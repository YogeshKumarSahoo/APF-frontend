"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Camera,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ArrowLeft,
  Navigation,
} from "lucide-react";

export default function BranchCapture() {
  const [branchId, setBranchId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isAndroid, setIsAndroid] = useState(false);
  const [currentStep, setCurrentStep] = useState("form"); // 'form', 'location', 'location-confirm', 'camera', 'success'
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [location, setLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  // Camera states
  const [cameraStep, setCameraStep] = useState(0); // 0: notice board, 1: waiting area, 2: branch board
  const [facingMode, setFacingMode] = useState("environment"); // 'user' for front, 'environment' for back
  const [capturedImages, setCapturedImages] = useState({
    noticeBoard: null,
    waitingArea: null,
    branchBoard: null,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const cameraSteps = [
    {
      title: "Notice Board Photo",
      description:
        "Take a clear photo of the branch notice board or information display",
      field: "noticeBoard",
    },
    {
      title: "Customer Waiting Area",
      description: "Take a photo of where customers sit and wait",
      field: "waitingArea",
    },
    {
      title: "Branch Name Board",
      description: "Take a photo of the branch name board outside the building",
      field: "branchBoard",
    },
  ];

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const androidDetected = userAgent.includes("android");
    setIsAndroid(androidDetected);

    if (!androidDetected) {
      setMessage("This app only works on Android phones");
      setMessageType("error");
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Validate branch ID (only numbers)
  const handleBranchIdChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setBranchId(value);
  };

  // Validate branch name
  const handleBranchNameChange = (e) => {
    const value = e.target.value;
    // Allow letters, spaces, hyphens, and numbers only at the end
    if (/^[a-zA-Z\s\-]*\d*$/.test(value) || value === "") {
      setBranchName(value);
    }
  };

  const captureLocation = async () => {
    if (!branchId.trim() || !branchName.trim()) {
      showMessage("Please fill Branch ID and Branch Name", "error");
      return;
    }

    if (!navigator.geolocation) {
      showMessage("Your phone does not support location", "error");
      return;
    }

    setCurrentStep("location");
    setIsCapturing(true);
    showMessage("Getting your location...", "info");

    // Commented out for local development - using hardcoded location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude });
        setLocationAccuracy(accuracy);
        setIsCapturing(false);
        setCurrentStep("location-confirm");
      },
      (error) => {
        setIsCapturing(false);
        setCurrentStep("form");
        let errorMessage = "Cannot get location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location not available";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timeout";
            break;
          default:
            errorMessage += "Unknown error";
            break;
        }

        showMessage(errorMessage, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );

    // Hardcoded location for local development (San Francisco coordinates)
    // setTimeout(() => {
    //   const latitude = 37.7749;
    //   const longitude = -122.4194;
    //   const accuracy = 10; // Mock accuracy in meters
      
    //   setLocation({ latitude, longitude });
    //   setLocationAccuracy(accuracy);
    //   setIsCapturing(false);
    //   setCurrentStep("location-confirm");
    // }, 1000); // Simulate async operation
  };

  const proceedToCamera = () => {
    setCurrentStep("camera");
    setCameraStep(0);
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      showMessage(
        "Cannot access camera. Please allow camera permission",
        "error",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg", 0.8);
    const currentField = cameraSteps[cameraStep].field;

    setCapturedImages((prev) => ({
      ...prev,
      [currentField]: base64,
    }));

    if (cameraStep < cameraSteps.length - 1) {
      setCameraStep(cameraStep + 1);
      showMessage("Photo saved! Next photo:", "success");
    } else {
      showMessage("All photos captured! Saving...", "success");
      stopCamera();
      submitData();
    }
  };

  const submitData = async () => {
    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchId: branchId.trim(),
          branchName: branchName.trim(),
          latitude: location.latitude,
          longitude: location.longitude,
          noticeBoardBase64: capturedImages.noticeBoard,
          waitingAreaBase64: capturedImages.waitingArea,
          branchBoardBase64: capturedImages.branchBoard,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("success");
      } else {
        showMessage(data.error || "Failed to save branch details", "error");
      }
    } catch (error) {
      console.error("Error saving:", error);
      showMessage("Failed to save. Please try again", "error");
    }
  };

  const resetAndStartOver = () => {
    // Reset all form data
    setBranchId("");
    setBranchName("");
    setLocation(null);
    setLocationAccuracy(null);
    setCapturedImages({
      noticeBoard: null,
      waitingArea: null,
      branchBoard: null,
    });
    setCameraStep(0);
    setCurrentStep("form");
    setMessage("");
    setMessageType("");
  };

  const goBack = () => {
    if (currentStep === "camera") {
      stopCamera();
      setCurrentStep("location-confirm");
      setCameraStep(0);
      setCapturedImages({
        noticeBoard: null,
        waitingArea: null,
        branchBoard: null,
      });
    } else if (currentStep === "location-confirm") {
      setCurrentStep("form");
    } else if (currentStep === "location") {
      setCurrentStep("form");
      setIsCapturing(false);
    }
  };

  const getAccuracyText = (accuracy) => {
    if (accuracy <= 5) return { text: "Excellent", color: "text-green-600" };
    if (accuracy <= 10) return { text: "Good", color: "text-blue-600" };
    if (accuracy <= 20) return { text: "Fair", color: "text-yellow-600" };
    return { text: "Poor", color: "text-red-600" };
  };

  if (!isAndroid) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Android Phone Required
          </h1>
          <p className="text-gray-600 text-sm">
            This app only works on Android phones. Please open this page on an
            Android device.
          </p>
        </div>
      </div>
    );
  }

  // Location Confirmation Step
  if (currentStep === "location-confirm") {
    const accuracyInfo = getAccuracyText(locationAccuracy);

    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Location Captured!
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Your branch location has been recorded
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Location Details
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latitude:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {location.latitude.toFixed(8)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Longitude:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {location.longitude.toFixed(8)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span
                      className={`text-sm font-medium ${accuracyInfo.color}`}
                    >
                      {Math.round(locationAccuracy)}m ({accuracyInfo.text})
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Navigation className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Next Step
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll now take 3 photos of your branch. Make sure you
                      have good lighting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={proceedToCamera}
                className="w-full py-4 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors text-lg"
              >
                <div className="flex items-center justify-center">
                  <Camera className="h-6 w-6 mr-2" />
                  Take Photos
                </div>
              </button>

              <button
                onClick={goBack}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Form
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "camera") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
        {/* Camera Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
          <button onClick={goBack} className="flex items-center text-white">
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back
          </button>
          <div className="text-center flex-1">
            <div className="text-sm opacity-75">Step {cameraStep + 1} of 3</div>
            <div className="font-medium">{cameraSteps[cameraStep].title}</div>
          </div>
          <button
            onClick={switchCamera}
            className="p-2 bg-gray-700 rounded-full"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Instructions */}
        <div className="bg-blue-600 text-white p-3 text-center shrink-0">
          <p className="text-sm">{cameraSteps[cameraStep].description}</p>
        </div>

        {/* Camera View Container - fills remaining space */}
        <div className="flex-1 relative overflow-hidden">
          {/* Camera viewfinder with aspect ratio constraint */}
          <div className="absolute inset-4 border-2 border-white border-opacity-50 rounded-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Capture Button - positioned above camera view */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
            <button
              onClick={takePhoto}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 active:scale-95 transition-transform shadow-lg"
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    );
  }

  // Success Confirmation Step
  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-green-50 py-6 px-4">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">
                Entry Added Successfully!
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Your branch details have been saved to the system
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  What was saved:
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Branch ID:</span>
                    <span className="text-sm font-medium text-green-900">
                      {branchId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Branch Name:</span>
                    <span className="text-sm font-medium text-green-900">
                      {branchName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Location:</span>
                    <span className="text-sm font-medium text-green-900">
                      ✓ Captured
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Photos:</span>
                    <span className="text-sm font-medium text-green-900">
                      ✓ 3 Photos
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Ready for Another?
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You can add more branch entries using the button below.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={resetAndStartOver}
              className="w-full py-4 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors text-lg"
            >
              <div className="flex items-center justify-center">
                <MapPin className="h-6 w-6 mr-2" />
                Add Another Entry
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <MapPin className="mx-auto h-12 w-12 text-blue-500 mb-3" />
            <h1 className="text-xl font-bold text-gray-900">
              Branch Registration
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Register your branch location and photos
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg border text-sm ${
                messageType === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : messageType === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              <div className="flex items-center">
                {messageType === "success" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {messageType === "error" && (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="branchId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Branch ID (Numbers Only)
              </label>
              <input
                type="text"
                id="branchId"
                value={branchId}
                onChange={handleBranchIdChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter branch ID"
                disabled={isCapturing}
              />
            </div>

            <div>
              <label
                htmlFor="branchName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Branch Name
              </label>
              <input
                type="text"
                id="branchName"
                value={branchName}
                onChange={handleBranchNameChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter branch name"
                disabled={isCapturing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Letters, spaces, hyphens (-), numbers at end only
              </p>
            </div>

            <button
              onClick={captureLocation}
              disabled={
                isCapturing ||
                !branchId.trim() ||
                !branchName.trim() ||
                currentStep !== "form"
              }
              className={`w-full py-4 px-4 rounded-lg font-medium transition-colors text-lg ${
                isCapturing ||
                !branchId.trim() ||
                !branchName.trim() ||
                currentStep !== "form"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              }`}
            >
              {currentStep === "location" && isCapturing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Getting Location...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  Capture Location
                </div>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              What You Need:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Allow location and camera access</li>
              <li>• Take 3 clear photos when asked</li>
              <li>• Good lighting for photos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
