const menu = JSON.stringify({
  "Board theme": {
    Woodgrain: "woodgrain",
    "Green-and-buff": "greenbuff"
  },
  "Pawn Promotion": {
    Queen: 'q',
    Rook: 'r',
    Bishop: 'b',
    Knight: 'n'
  },
  Opponent: {
    "Vs self": -1,
    "Vs CPU black": 1,
    "Vs CPU white": 0
  },
  "Time control": {
    untimed: "-",
    "G/30": "1800",
    "G/60": "3600",
    "G/90+30": "5400+30",
    "40/90+30, SD/30+30": "40/5400+30:1800+30",
    "40/100+30, 20/50+30, SD/15+30": "40/6000+30:20/3000+30:900+30",
    "40/120, ...": {
      "SD/30": "40/7200:1800",
      "SD/60": "40/7200:3600",
      "20/60, SD/30": "40/7200:20/3600:1800",
      "20/60, SD/15+30": "40/7200:20/3600:900+30"
    },
    Rapid: {
      "G/15+10": "900+10",
      "G/15+5": "900+5",
      "G/25+10": "1500+10",
      "G/25": "1500"
    },
    Blitz: {
      "G/3+2": "180+2",
      "G/5": "300",
      "G/5+3": "300+3"
    }
  }
});

/**
 *
 * @param {Object} tree nested object with each object at every nest level
 *      having no more than 10 key-value pairs
 * @param {string} path a sequence of single-digit indices ({@link tree}'s max
 *     10 key-value pairs per object) representing one choice of path through
 *     object nest levels: 1st index represents a selection of key-value pair
 *     from the whole {@link tree}, and each next index representing a
 *     selection of key-value from the object indicated by the previous index
 * @param {number} depth the index of position in the path sequence indicating nest
 *     level at which to obtain an object/value
 * @returns nested value indicated by path and depth
 */
function getNodeValue(tree, path, depth = path.length) {
  if (depth == 0) {
    return Object.freeze(tree);
  }
  return Object.freeze(
    getNodeValue(tree, path, depth - 1)[
      Object.keys(
        getNodeValue(tree, path, depth - 1)
      )[ path[depth - 1] ]
    ]
  );
}

/**
 *
 * @param {string} path as defined by {@link getNodeValue} param "path"
 * @returns boolean, whether the given path, when applied to the {@link menu}
 *     of chess434-ui-data only, ends with a value that is not an object that
 *     represents another submenu
 */
const isLeaf = path => {
  return (
    path.length === 3 ||
    path.length === 2 &&
    (path[0] < 3 || path[1] < 6)
  );
};

const indexOfPawnPromotion = (
  Object.keys( JSON.parse(menu) ).indexOf("Pawn Promotion")
);

/**
 *
 * @param {string} tag time control tag based on the Portable Game Notation
 *     (PGN) standard, allowing for the combination of the PGN's
 *     required-move-type and increment-type in order to adequately describe
 *     certain FIDE time periods
 * @returns array of objects each representing a time period of a chess game,
 *     time periods indexed in order of play, each object indicating initial
 *     time on the chess clock, the bonus time increment per move, and the
 *     number of moves that must be made before time is up
 */
function parseTC(tag) {
  return Object.freeze(tag.split(':').map(field => {
    if (field === "-") {
      return Object.freeze({ init: Infinity, bonus: 0, goal: 0 });
    }
    return Object.freeze({
      init: parseInt(field.split('/').at(-1).split('+')[0]),
      bonus: parseInt(field.split('+')[1]) || 0,
      goal: parseInt( field.split('/').at(-2) ) || 0
    });
  }));
}

const cred = JSON.stringify({
  content: "Chess vector images",
  lang: "en",
  user: "User:Cburnett",
  lic: 'by-sa',
  ver: '3.0'
});

const fnames = JSON.stringify([
  'kdt', 'klt', 'qdt', 'qlt', 'rdt', 'rlt',
  'bdt', 'blt', 'ndt', 'nlt', 'pdt', 'plt'
]);

const params = JSON.stringify([
  1499803, 1499806, 1499811, 1499812, 1499813, 1499814,
  1499800, 1499801, 1499807, 1499808, 1499809, 1499810
]);

export default {
  menu,
  getNodeValue,
  isLeaf,
  indexOfPawnPromotion,
  parseTC,
  cred,
  fnames,
  params
};
