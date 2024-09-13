const originalWidth = 1920;
const originalHeight = 2193;
const originalTileCornerY = 540;

const widthToHeight = originalWidth / originalHeight;

export const getTileHeight = (tileWidth: number) => tileWidth / widthToHeight;
export const getTileCornerY = (tileHeight: number) =>
  (tileHeight / originalHeight) * originalTileCornerY;

export const getNumCombinations = (diceSum: number) => {
  let n = 0;
  for (let i = 1; i <= 6; i++) {
    if (diceSum - i <= 6 && diceSum - i >= 1) {
      n++;
    }
  }
  return n;
};
