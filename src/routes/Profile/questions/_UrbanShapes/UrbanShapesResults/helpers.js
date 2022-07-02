export const colorGradient = (fadeFraction) => {
  var rgbColor1 = {
    red: 19,
    green: 233,
    blue: 19,
  };
  var rgbColor2 = {
    red: 255,
    green: 0,
    blue: 0,
  };
  var rgbColor3 = {
    red: 255,
    green: 255,
    blue: 0,
  };

  console.log(">> fade: ", fadeFraction);
  var color1 = rgbColor1;
  var color2 = rgbColor2;
  var fade = fadeFraction;

  // Do we have 3 colors for the gradient? Need to adjust the params.
  if (rgbColor3) {
    fade = fade * 2;

    // Find which interval to use and adjust the fade percentage
    if (fade >= 1) {
      fade -= 1;
      color1 = rgbColor2;
      color2 = rgbColor3;
    }
  }

  var diffRed = color2.red - color1.red;
  var diffGreen = color2.green - color1.green;
  var diffBlue = color2.blue - color1.blue;

  var gradient = {
    red: parseInt(Math.floor(color1.red + diffRed * fade), 10),
    green: parseInt(Math.floor(color1.green + diffGreen * fade), 10),
    blue: parseInt(Math.floor(color1.blue + diffBlue * fade), 10),
  };

  return (
    "rgb(" + gradient.red + "," + gradient.green + "," + gradient.blue + ")"
  );
};
