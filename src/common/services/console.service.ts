
export class Console {
  public static reset = "\x1b[0m";

  public static gray = {
    darkest: "\x1b[30m",      // Black/Darkest gray
    dark: "\x1b[90m",         // Bright black/Dark gray
    medium: "\x1b[2m\x1b[37m", // Dimmed white/Medium gray
    light: "\x1b[37m",        // White/Light gray
    lightest: "\x1b[97m",     // Bright white/Lightest gray
  };

  public static red = {
    darkest: "\x1b[31m",      // Red/Dark red
    dark: "\x1b[91m",         // Bright red/Red
    medium: "\x1b[31m\x1b[1m", // Bold red/Medium red
    light: "\x1b[91m\x1b[2m",  // Dimmed bright red/Light red
    lightest: "\x1b[31m\x1b[2m", // Dimmed red/Lightest red
  };

  public static yellow = {
    darkest: "\x1b[33m\x1b[2m",  // Dimmed yellow/Darkest yellow
    dark: "\x1b[33m",            // Yellow/Dark yellow
    medium: "\x1b[93m\x1b[2m",   // Dimmed bright yellow/Medium yellow
    light: "\x1b[93m",           // Bright yellow/Light yellow
    lightest: "\x1b[93m\x1b[1m", // Bold bright yellow/Lightest yellow
    cream: "\x1b[38;5;229m",
  };

  public static white = {
    darkest: "\x1b[37m\x1b[2m",  // Dimmed white/Darkest white (light gray)
    dark: "\x1b[37m",            // White/Dark white
    medium: "\x1b[97m\x1b[2m",   // Dimmed bright white/Medium white
    light: "\x1b[97m",           // Bright white/Light white
    lightest: "\x1b[97m\x1b[1m", // Bold bright white/Lightest white
  };
}

export default Console;
