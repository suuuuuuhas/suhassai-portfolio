/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
// Keeping this project on the standard Webpack bundler makes local rendering
// deterministic on the current Windows machine; no Tailwind utilities are used.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
