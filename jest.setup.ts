import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
process.env.VITE_API_URL = "http://localhost:3000";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
