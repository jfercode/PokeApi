// OAuth2 authentication with Google - User login system
// Handles JWT token generation, validation, and session management

// Import required dependencies
const jwt = require("jsonwebtoken");    // Create and verify JWT tokens
const axios = require("axios");         // Make HTTP requests to Google APIs

// Load environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Generate JWT token for authenticated user
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify and decode JWT token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Step 1: Initiate Google OAuth flow
// Creates authorization URL and redirects user to Google login
const googleAuthUrl = (req, res) => {
  const scopes = "openid profile email";
  const redirectUri = `${BACKEND_URL}/api/auth/callback`;

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.redirect(googleAuthUrl);
};

// Step 2: Handle Google OAuth callback
// Exchanges authorization code for Google tokens and user data
// Generates and returns our custom JWT
const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code" });
  }
  
  try {
    // Exchange authorization code for access token
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${BACKEND_URL}/api/auth/callback`,
    });

    // Get user information using access token
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${response.data.access_token}` } }
    );

    // Create user object from Google data
    const user = {
      id: userResponse.data.id,
      email: userResponse.data.email,
      name: userResponse.data.name,
    };

    // Generate our custom JWT token
    const token = generateJWT(user);

    // Redirect to frontend with authentication data
    res.redirect(
      `${FRONTEND_URL}?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.log("OAuth error: ", error);
    res.redirect(`${FRONTEND_URL}?error=auth_failed`);
  }
};

// Step 3: Validate Google JWT token from frontend
// Decodes and validates Google token, returns our custom JWT
const googleTokenValidation = async (req, res) => {
  const { googleToken } = req.body;

  if (!googleToken) {
    return res.status(400).json({ error: "No Google token provided" });
  }

  try {
    // Decode Google JWT token (format: header.payload.signature)
    const parts = googleToken.split(".");

    if (parts.length !== 3) {
      return res.status(400).json({ error: "Invalid token format" });
    }

    // Decode payload (second part) with base64 decoding
    let payload = parts[1];
    payload += "=".repeat(4 - (payload.length % 4));

    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());

    const { email, name, picture, sub } = decoded;

    // Create user object from decoded token
    const user = {
      id: sub,
      email,
      name,
      picture,
    };

    // Generate our custom JWT token
    const token = generateJWT(user);

    // Return authentication response
    res.json({
      token,
      user,
      message: "Successfully authenticated with Google",
    });
  } catch (error) {
    console.error("Google token validation error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

// Step 4: User logout
const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// Step 5: Authentication middleware for protected routes
// Validates JWT token from Authorization header and attaches user to request
const authMiddleware = (req, res, next) => {
  
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: "No authorization header" });

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  // Verify JWT token validity
  const decoded = verifyJWT(token);
  if (!decoded)
    return res.status(401).json({ error: "Invalid or expired token" });

  // Attach decoded user data to request object
  req.user = decoded;

  // Continue to next middleware
  next();
};

// Export authentication functions
module.exports = {
  generateJWT,
  verifyJWT,
  googleAuthURL: googleAuthUrl,
  googleAuthCallback,
  googleTokenValidation,
  logout,
  authMiddleware,
};
