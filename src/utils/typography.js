import Typography from "typography";
import Alton from "typography-theme-alton";

Alton.overrideThemeStyles = () => {
  return {
    a: {
      color: `#38657D`,
    },
  };
};

const typography = new Typography(Alton);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
