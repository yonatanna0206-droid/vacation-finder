
import { useState } from "react";

interface RegisterProps {
  onNavigateToVacations?: () => void;
}

export default function Register({ onNavigateToVacations }: RegisterProps) {
  // Individual state variable for each field (no combined data collection)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error message state for each field
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 1. Full Name Validation: First and last name, at least 2 chars each, letters only
  const validateFullName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return "Full name is required.";
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) {
      return "Please enter both first and last name.";
    }
    // Letters only (supports English and Hebrew characters)
    const lettersOnlyRegex = /^[A-Za-z\u0590-\u05FF]+$/;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length < 2) {
        return "Each name must be at least 2 characters long.";
      }
      if (!lettersOnlyRegex.test(parts[i])) {
        return "Name cannot contain numbers or special characters.";
      }
    }
    return ""; // valid
  };

  // 2. Email Address Validation: standard valid email format
  const validateEmail = (emailVal: string) => {
    const trimmed = emailVal.trim();
    if (!trimmed) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address (e.g., name@domain.com).";
    }
    return ""; // valid
  };

  // 3. Password Validation: >= 8 characters, uppercase, lowercase, and numbers
  const validatePassword = (passVal: string) => {
    if (!passVal) {
      return "Password is required.";
    }
    if (passVal.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(passVal)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(passVal)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/[0-9]/.test(passVal)) {
      return "Password must include at least one number.";
    }
    return ""; // valid
  };

  // 4. Confirm Password Validation: Must match password exactly
  const validateConfirmPassword = (confirmVal: string, passVal: string) => {
    if (!confirmVal) {
      return "Please confirm your password.";
    }
    if (confirmVal !== passVal) {
      return "Passwords do not match.";
    }
    return ""; // valid
  };

  // Dynamic change handlers: update state and clear error once criteria are met
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    if (fullNameError) {
      setFullNameError(validateFullName(val));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      setEmailError(validateEmail(val));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) {
      setPasswordError(validatePassword(val));
    }
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, val));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(val, password));
    }
  };

  // Form validity: all fields filled and all validations pass
  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    validateFullName(fullName) === "" &&
    validateEmail(email) === "" &&
    validatePassword(password) === "" &&
    validateConfirmPassword(confirmPassword, password) === "";

  // Trigger validation on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    setFullNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);

    if (nameErr || emailErr || passErr || confirmErr) {
      return;
    }

    if (onNavigateToVacations) {
      onNavigateToVacations();
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-body-md text-on-surface bg-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TOP APP BAR */}
      <header className="docked full-width top-0 sticky z-50 h-[72px] bg-surface-container-lowest/95 dark:bg-inverse-surface/95 backdrop-blur-md border-b border-outline-variant/40 dark:border-outline/30 shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-margin h-full">
          {/* Brand Logo Anchor */}
          <a className="flex items-center gap-space-xs focus:outline-none" href="#">
            <span
              className="material-symbols-outlined text-secondary dark:text-primary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              explore
            </span>
            <span className="font-headline-md text-headline-md font-bold text-secondary dark:text-primary-fixed-dim tracking-tight">
              TripSync
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-space-xl">
            <a
              className="text-secondary dark:text-inverse-on-surface font-title-md text-title-md transition-colors hover:text-primary-container dark:hover:text-primary-fixed duration-150"
              href="#"
            >
              Home
            </a>
            <button
              onClick={onNavigateToVacations}
              className="text-secondary dark:text-inverse-on-surface font-title-md text-title-md transition-colors hover:text-primary-container dark:hover:text-primary-fixed duration-150 cursor-pointer"
            >
              My Vacations
            </button>
            <a
              className="text-secondary dark:text-inverse-on-surface font-title-md text-title-md transition-colors hover:text-primary-container dark:hover:text-primary-fixed duration-150"
              href="#"
            >
              About Us
            </a>
          </nav>

          {/* Trailing Action: Sign In Link + Primary CTA */}
          <div className="flex items-center gap-space-md">
            <button
              onClick={onNavigateToVacations}
              className="text-primary font-title-md text-title-md hover:text-primary-container transition-colors duration-150 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">lock</span>
              <span>Sign In</span>
            </button>
            <button
              onClick={onNavigateToVacations}
              className="hidden sm:inline-flex items-center justify-center bg-tertiary-container hover:bg-tertiary text-on-tertiary font-title-md text-title-md px-space-md py-space-xs rounded-lg active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
            >
              Plan Trip
            </button>
          </div>
        </div>
      </header>

      {/* MAIN REGISTRATION CANVAS */}
      <main className="flex-grow flex items-center justify-center py-space-xl px-margin-mobile md:px-margin">
        <div className="w-full max-w-[1280px] mx-auto">
          {/* Split-Screen Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
            {/* Left Column: Inspiring Destination Visuals & Perks */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-xl overflow-hidden p-space-lg md:p-space-xl bg-surface-container-lowest border border-outline-variant/30 relative">
              {/* Editorial Destination Gallery Bento Layout */}
              <div className="space-y-space-lg relative z-10">
                {/* Logo & Brand Slogan Anchor */}
                <div className="space-y-space-xs">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wide">
                    <span
                      className="material-symbols-outlined text-label-md"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      auto_awesome
                    </span>
                    Smart Travel Curator
                  </div>
                  <h1 className="font-headline-lg text-headline-lg font-bold text-secondary tracking-tight">
                    Find the vacation that fits you best
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                    Create your free account to unlock tailor-made trips designed around your budget, climate, and travel passions.
                  </p>
                </div>

                {/* Curated Destination Collage Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
                  {/* Card 1: Coast & Beaches */}
                  <div className="relative group rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-low h-44 sm:h-56 flex flex-col justify-end p-space-md shadow-sm transition-all duration-200 hover:border-primary-container">
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-alt="Sun-drenched turquoise tropical coast with dramatic granite sea cliffs, golden beach sands, and gentle rolling waves under a clear sky. Shot with a crisp, minimal travel aesthetic showcasing luminous natural sunlight and crystal azure water tones."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfc2l00__wFY3FJaIaVgl71M_xR_qG4mUNetUxeefb9RJCmpjZr2FN-FS-yhahp2YX59m0c2W9tAXm8QBDnnFYjmP8pQzd-HebKR2kzZ1Hk84tAnxJP_jbpbhYez2PIadHZzsqZAYf5sBbkAOTKjlphuFI8cMXby83iumB6c8Euho9ZY_65KCx5ZYpXx7tZsvedbB0htWNGibpOkkEZsmDDu0fwf33vuttCJefM0ZqGm1SihVjI3rd"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                    <div className="relative z-10 text-on-primary">
                      <span className="inline-block bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                        98% Match
                      </span>
                      <p className="font-title-md text-title-md font-bold leading-tight">Amalfi Coast</p>
                      <p className="font-label-sm text-label-sm opacity-90">Warm Mediterranean</p>
                    </div>
                  </div>

                  {/* Card 2: Modern Alpine / Mountains */}
                  <div className="relative group rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-low h-44 sm:h-56 flex flex-col justify-end p-space-md shadow-sm transition-all duration-200 hover:border-primary-container">
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-alt="Majestic sharp snowcapped mountain peaks towering over a calm reflective alpine lake at sunrise with clean minimal cool blue hues and morning mist. Pristine Nordic landscape rendered with crisp photographic clarity and serene cool tones."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3luiRCdeStbHiTw-3RdCd8i6O1QRij7AViNd0OxvlLdf_fsLMZA5-S1deWZyNCH58YNb9gx-dUpDfGRcxKtoaF-kEjIqIL9E5tdpoZgQrdsAQPSJXu8n2Mbgi7bJC7DccHCcbw-4_UphwF-TKXKzzkY4DGTJUM1Jp1B6NCN5_jOgYZzZS-zdY5n3tKIdlLCdX9Wi9xD_0cleYquzevYVfbh2s-LEOc-VXQ9lQ44H-ksS8JRaz6G_l"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                    <div className="relative z-10 text-on-primary">
                      <span className="inline-block bg-tertiary-container text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                        Alpine Calm
                      </span>
                      <p className="font-title-md text-title-md font-bold leading-tight">Dolomites</p>
                      <p className="font-label-sm text-label-sm opacity-90">Brisk &amp; Scenic</p>
                    </div>
                  </div>

                  {/* Card 3: Cultural Cities */}
                  <div className="relative group rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-low h-44 sm:h-56 flex flex-col justify-end p-space-md shadow-sm transition-all duration-200 hover:border-primary-container">
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-alt="Vibrant modern historic European city street at twilight with warm illuminated cafe terraces, clean architectural facades, and cobblestone pathways. Bright ambient lighting balancing warm amber lantern glows with deep serene navy sky."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuACxSqdksXGI3I5l1piq5HgXe9JI5tHxIEXju5NHCdvmWLeRCQYVcSjLLMXr1MyNKLSq8yK6vrleiJ1pBnWyU-BUfMhUb6TJO0O1aPSYi5_KKQpAjK2gzI2gZIt9HJjf0d-wiPfP-1uwSeIWAjkIOjsqk7v4cthIug49O_mr2G4_sVerBGlWfPtoOgm0r1jU7TNNYoY37hPCgWDCr7Qmic7tDmUw0TR3p8QjzPVi7Cx3IyH79RY2KJj"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                    <div className="relative z-10 text-on-primary">
                      <span className="inline-block bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                        Culture Pick
                      </span>
                      <p className="font-title-md text-title-md font-bold leading-tight">Kyoto &amp; Tokyo</p>
                      <p className="font-label-sm text-label-sm opacity-90">Temples &amp; Skylines</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Minimal Perks Grid */}
              <div className="mt-space-lg pt-space-md border-t border-outline-variant/30">
                <h3 className="font-label-lg text-label-lg text-on-surface-variant font-bold uppercase tracking-wider mb-space-md">
                  Why travelers build itineraries with TripSync
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                  {/* Perk 1 */}
                  <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span
                        className="material-symbols-outlined text-title-md"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        tune
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-secondary text-sm">
                        100% Tailored Suggestions
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                        Custom filters aligned to your budget and travel pace.
                      </p>
                    </div>
                  </div>

                  {/* Perk 2 */}
                  <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                      <span
                        className="material-symbols-outlined text-title-md"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        thermostat
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-secondary text-sm">
                        Smart Climate Matching
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                        Real-time weather modeling for ideal seasonal visits.
                      </p>
                    </div>
                  </div>

                  {/* Perk 3 */}
                  <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                      <span
                        className="material-symbols-outlined text-title-md"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        group
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-secondary text-sm">
                        Group Trip Collaboration
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                        Vote on destinations and split expenses effortlessly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Card Surface */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/50 p-space-lg md:p-space-xl shadow-sm">
                <div className="mb-space-md">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider">
                    Get Started
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-secondary mt-1">
                    Create your account
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Sign up in seconds to start building your vacation bucket list.
                  </p>
                </div>

                {/* Social Quick Sign Up Options */}
                <div className="mb-space-md">
                  <button
                    className="w-full flex items-center justify-center gap-space-xs h-12 px-space-md rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-title-md text-title-md hover:bg-surface-container hover:border-outline transition-colors duration-150 active:scale-[0.98]"
                    type="button"
                  >
                    {/* Google Mark SVG Icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.28 14.26A7.17 7.17 0 014.89 12c0-.79.14-1.57.39-2.26V6.59H1.27A11.96 11.96 0 000 12c0 1.92.45 3.74 1.27 5.41l4.01-3.15z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.2 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.15c.95-2.84 3.6-4.97 6.72-4.97z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-space-xs items-center mb-space-md">
                  <div className="flex-grow border-t border-outline-variant/60" />
                  <span className="flex-shrink mx-space-sm text-outline font-label-sm text-label-sm tracking-wide">
                    OR WITH EMAIL
                  </span>
                  <div className="flex-grow border-t border-outline-variant/60" />
                </div>

                {/* Registration Form */}
                <form
                  action="#"
                  className="space-y-space-md"
                  method="POST"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Full Name Field */}
                  <div>
                    <label
                      className="block font-label-md text-label-md text-on-surface font-semibold mb-1"
                      htmlFor="full-name"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-space-md bg-surface-container-lowest border rounded-lg placeholder:text-outline font-body-md text-body-md focus:ring-2 focus:outline-none transition-all duration-150 ${
                          fullNameError
                            ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-200"
                            : "border-outline-variant text-on-surface focus:border-primary-container focus:ring-primary-container/20"
                        }`}
                        id="full-name"
                        name="full_name"
                        placeholder="E.g., Elena Vance"
                        type="text"
                        value={fullName}
                        onChange={handleFullNameChange}
                        onBlur={() => setFullNameError(validateFullName(fullName))}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                        person
                      </span>
                    </div>
                    {fullNameError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{fullNameError}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className="block font-label-md text-label-md text-on-surface font-semibold mb-1"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-space-md bg-surface-container-lowest border rounded-lg placeholder:text-outline font-body-md text-body-md focus:ring-2 focus:outline-none transition-all duration-150 ${
                          emailError
                            ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-200"
                            : "border-outline-variant text-on-surface focus:border-primary-container focus:ring-primary-container/20"
                        }`}
                        id="email"
                        name="email"
                        placeholder="elena.vance@example.com"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => setEmailError(validateEmail(email))}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                        mail
                      </span>
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{emailError}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      className="block font-label-md text-label-md text-on-surface font-semibold mb-1"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-space-md bg-surface-container-lowest border rounded-lg placeholder:text-outline font-body-md text-body-md focus:ring-2 focus:outline-none transition-all duration-150 ${
                          passwordError
                            ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-200"
                            : "border-outline-variant text-on-surface focus:border-primary-container focus:ring-primary-container/20"
                        }`}
                        id="password"
                        name="password"
                        placeholder="At least 8 characters"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => setPasswordError(validatePassword(password))}
                      />
                      <button
                        aria-label="Toggle password visibility"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface focus:outline-none"
                        type="button"
                      >
                        <span className="material-symbols-outlined pointer-events-none">visibility</span>
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{passwordError}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      className="block font-label-md text-label-md text-on-surface font-semibold mb-1"
                      htmlFor="confirm-password"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full h-12 px-space-md bg-surface-container-lowest border rounded-lg placeholder:text-outline font-body-md text-body-md focus:ring-2 focus:outline-none transition-all duration-150 ${
                          confirmPasswordError
                            ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-200"
                            : "border-outline-variant text-on-surface focus:border-primary-container focus:ring-primary-container/20"
                        }`}
                        id="confirm-password"
                        name="confirm_password"
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        onBlur={() => setConfirmPasswordError(validateConfirmPassword(confirmPassword, password))}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                        lock_reset
                      </span>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{confirmPasswordError}</p>
                    )}
                  </div>

                  {/* Terms Notice */}
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    By creating an account, you agree to TripSync's{" "}
                    <a className="text-primary hover:underline font-semibold" href="#">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a className="text-primary hover:underline font-semibold" href="#">
                      Privacy Policy
                    </a>
                    .
                  </p>

                  {/* Primary Submit CTA Button (Disabled until form is valid) */}
                  <button
                    className={`w-full h-12 flex items-center justify-center gap-space-xs font-title-md text-title-md font-bold rounded-lg shadow-sm transition-all duration-150 ${
                      !isFormValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                        : "bg-tertiary-container hover:bg-tertiary text-on-tertiary hover:shadow active:scale-[0.98] cursor-pointer"
                    }`}
                    type="submit"
                    disabled={!isFormValid}
                  >
                    <span>Sign Up</span>
                    <span className="material-symbols-outlined text-body-lg">arrow_forward</span>
                  </button>
                </form>

                {/* Helper Log In Link */}
                <div className="mt-space-lg text-center pt-space-sm border-t border-outline-variant/30">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Already have an account?
                    <button
                      onClick={onNavigateToVacations}
                      className="font-title-md text-title-md font-semibold text-secondary hover:text-primary-container underline transition-colors duration-150 ml-1 cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="full-width bottom bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant/30 dark:border-outline/20 flat no shadows mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1280px] mx-auto px-margin py-space-lg gap-space-md">
          {/* Logo & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-space-sm text-center sm:text-left">
            <span className="font-headline-sm text-headline-sm font-semibold text-secondary dark:text-primary-fixed-dim">
              TripSync
            </span>
            <span className="hidden sm:inline text-outline-variant">•</span>
            <p className="text-on-surface-variant dark:text-outline-variant font-body-sm text-body-sm">
              © 2024 TripSync Technologies Inc. All rights reserved. Find the vacation that fits you best.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-space-lg">
            <a
              className="text-on-surface-variant dark:text-outline-variant font-body-sm text-body-sm hover:text-primary dark:hover:text-primary-fixed transition-colors duration-150 active:opacity-80"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant dark:text-outline-variant font-body-sm text-body-sm hover:text-primary dark:hover:text-primary-fixed transition-colors duration-150 active:opacity-80"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant dark:text-outline-variant font-body-sm text-body-sm hover:text-primary dark:hover:text-primary-fixed transition-colors duration-150 active:opacity-80"
              href="#"
            >
              Support
            </a>
            <a
              className="text-on-surface-variant dark:text-outline-variant font-body-sm text-body-sm hover:text-primary dark:hover:text-primary-fixed transition-colors duration-150 active:opacity-80"
              href="#"
            >
              Destinations
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
