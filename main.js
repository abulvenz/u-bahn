import m from "mithril";
import tagl, { filter, s } from "tagl-mithril";

const { div, svg, g, path, rect, text, circle, button } = tagl(m);
const { trunc, random, min } = Math;

const randomElementIndex = (arr) => trunc(random() * arr.length);
const without = (arr, idx) => arr.filter((e, i) => i !== idx);

const shuffle = (arr, result = []) =>
  arr.length === 0
    ? result
    : use(randomElementIndex(arr), (next) =>
        shuffle(without(arr, next), [...result, arr[next]]),
      );

const range = (() => {
  const arr = [];
  return (N) => {
    if (N > arr.length) {
      for (let i = arr.length; i < N; i++) {
        arr.push(i);
      }
    }
    return arr.slice(0, N);
  };
})();
const use = (v, f) => f(v);
const size = min(innerWidth / 9, innerHeight / 9);

const circleSize = size / 30;

const controlSize = size / 4;
const gap = 2;

const showConnectors = true;
const showControl = false;
const showNumbers = false;
const cards = [
  { g: "0123", count: 2 },
  { g: "0132", count: 2 },
  { g: "0213", count: 2 },
  { g: "0231", count: 2 },
  { g: "0312", count: 2 },
  { g: "0321", count: 2 },

  { g: "1023", count: 2 },
  { g: "1032", count: 3 },
  { g: "1203", count: 2 },
  { g: "1230", count: 4 },
  { g: "1302", count: 2 },
  { g: "1320", count: 2 },

  { g: "2013", count: 2 },
  { g: "2031", count: 4 },
  { g: "2103", count: 2 },
  { g: "2130", count: 2 },
  { g: "2301", count: 4 },
  { g: "2310", count: 4 },

  { g: "3012", count: 2 },
  { g: "3021", count: 2 },
  { g: "3102", count: 2 },
  { g: "3120", count: 2 },
  { g: "3201", count: 4 },
  { g: "3210", count: 3 },
];

//if (cards.map((e) => e.count).reduce((acc, v) => acc + v) !== 60) throw Error();

const DIR = Object.freeze({
  LEFT: 0,
  BOTTOM: 1,
  RIGHT: 2,
  TOP: 3,
});

const connectors = [
  {
    x: circleSize / 2,
    y: (size * 2) / 3,
    cx: controlSize,
    cy: 0,
    prev: -2,
    dir: DIR.LEFT,
  },
  {
    x: (size * 2) / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    prev: 70,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: size / 3,
    cx: -controlSize,
    cy: 0,
    prev: 10,
    dir: DIR.RIGHT,
  },
  {
    x: size / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    prev: -62,
    dir: DIR.TOP,
  },
  {
    x: circleSize / 2,
    y: size / 3,
    cx: controlSize,
    cy: 0,
    next: -10,
    dir: DIR.LEFT,
  },
  {
    x: size / 3,
    y: size - circleSize / 2,
    cx: 0,
    cy: -controlSize,
    next: 62,
    dir: DIR.BOTTOM,
  },
  {
    x: size - circleSize / 2,
    y: (size * 2) / 3,
    cx: -controlSize,
    cy: 0,
    next: 2,
    dir: DIR.RIGHT,
  },
  {
    x: (size * 2) / 3,
    y: circleSize / 2,
    cx: 0,
    cy: controlSize,
    next: -70,
    dir: DIR.TOP,
  },
];

const isCenter = (idx = -1, c) =>
  (idx === 19 && c.dir === DIR.BOTTOM) ||
  (idx === 20 && c.dir === DIR.BOTTOM) ||
  (idx === 26 && c.dir === DIR.RIGHT) ||
  (idx === 29 && c.dir === DIR.LEFT) ||
  (idx === 34 && c.dir === DIR.RIGHT) ||
  (idx === 37 && c.dir === DIR.LEFT) ||
  (idx === 43 && c.dir === DIR.TOP) ||
  (idx === 44 && c.dir === DIR.TOP);

const isBoundary = (x = -1, y = -1, idx = -1, c) =>
  (x === 0 && c.dir === DIR.LEFT) ||
  (x === 7 && c.dir === DIR.RIGHT) ||
  (y === 0 && c.dir === DIR.TOP) ||
  (y === 7 && c.dir === DIR.BOTTOM);

const isTerminal = (x, y, idx, c) =>
  isBoundary(x, y, idx, c) || isCenter(idx, c);

const isStart = (c) => c.prev !== undefined;

const card = (vnode) => ({
  view: (vnode) =>
    g(
      {
        transform: `translate(${vnode.attrs.x * (size + gap) + 15},${
          vnode.attrs.y * (size + gap) + 15
        })`,
      },
      rect({ x: 0, y: 0, width: size, height: size, fill: `gray` }),

      (vnode.attrs.card || "").split("").map((to, from) =>
        use(
          `M ${connectors[from].x},${connectors[from].y}
              C ${connectors[from].x + connectors[from].cx},${
                connectors[from].y + connectors[from].cy
              } 
                ${connectors[+to + 4].x + connectors[+to + 4].cx},${
                  connectors[+to + 4].y + connectors[+to + 4].cy
                }
                ${connectors[+to + 4].x},${connectors[+to + 4].y}
             `,
          (pd) => [
            path({
              d: pd,
              "stroke-width": "17px",
              fill: `none`,
              stroke: `black`,
            }),
            path({
              d: pd,
              "stroke-width": "15px",
              fill: `none`,
              stroke: `gray`,
            }),
            path({
              d: pd,
              "stroke-width": "10px",
              fill: `none`,
              "stroke-dasharray": "2,3",
              stroke: `saddlebrown`,
            }),
            path({
              d: pd,
              "stroke-width": "7px",
              fill: `none`,
              stroke: `black`,
            }),
            path({
              d: pd,
              "stroke-width": "6px",
              fill: `none`,
              stroke: `gray`,
            }),
            path({
              d: pd,
              "stroke-width": "5px",
              fill: `none`,
              "stroke-dasharray": "2,3",
              stroke: `saddlebrown`,
            }),
          ],
        ),
      ),
      !showConnectors
        ? null
        : use((vnode.attrs.x + 8 * vnode.attrs.y) * 8, (base) =>
            connectors.map((c, cnt) =>
              use(
                isTerminal(vnode.attrs.x, vnode.attrs.y, base / 8, c),
                (b) => [
                  circle({
                    cx: c.x,
                    cy: c.y,
                    r: circleSize,
                    fill: state.path.includes(cnt + base)
                      ? "yellow"
                      : b //&& isStart(c) && !isCenter(vnode.attrs.idx, c)
                        ? "blue"
                        : c.next
                          ? "none"
                          : "green",
                    onmouseover: (e) =>
                      b && isStart(c) && !isCenter(vnode.attrs.idx, c)
                        ? [
                            (state.selected = cnt + base),
                            (state.path = mark(state.selected)),
                          ]
                        : null,
                  }),
                  !showControl
                    ? null
                    : circle({
                        cx: c.x + c.cx,
                        cy: c.y + c.cy,
                        r: circleSize,
                        fill: "blue",
                      }),
                  !showNumbers
                    ? null
                    : [
                        text(
                          {
                            x: c.x - circleSize / 2,
                            y: c.y + circleSize / 2,
                            fill: "white",
                            style: `font:33px;`,
                          },
                          cnt + base,
                        ),
                        text(
                          {
                            x: size / 3,
                            y: size / 2,
                            fill: "white",
                          },
                          vnode.attrs.x,
                          " ",
                          vnode.attrs.y,
                        ),
                        text(
                          {
                            x: size / 3,
                            y: size / 2 + 15,
                            fill: "white",
                          },
                          (vnode.attrs.x + 8 * vnode.attrs.y) * 8,
                        ),
                      ],
                ],
              ),
            ),
          ),
      text(
        {
          x: size / 3,
          y: size / 2 + 7,
          fill: "white",
        },
        vnode.attrs.x + 8 * vnode.attrs.y,
        "",
      ),
    ),
});

const state2 = cards.flatMap((e) => range(e.count).map((i) => e.g));
const state = {
  cards: shuffle(state2.slice(0, state2.length)),
  selected: 384,
  fields: [],
  path: [384],
};

state.fields = range(8)
  .flatMap((j) =>
    range(8).map((i) =>
      ![27, 28, 35, 36].includes(j * 8 + i)
        ? // i < 3 || i >= 5 || j < 3 || j >= 5
          use(
            use(j * 8 + i, (idx) => (idx < 27 ? 0 : idx < 37 ? -2 : -4) + idx),
            (cIdx) => ({
              i,
              j,
              cardIdx: cIdx,
              card: state.cards[cIdx],
            }),
          )
        : null,
    ),
  )
  .filter((e) => !!e);

console.log(state.fields);

const mark = (first, result = []) => {
  result.push(first);

  const connector = first % 4;
  const coordIdx = (first - connector) / 8;
  const cardIdx = use(
    coordIdx,
    (idx) => (idx < 27 ? 0 : idx < 37 ? -2 : -4) + idx,
  );

  const field = state.fields[cardIdx];

  if (!field) {
    console.log("Nö", cardIdx, coordIdx, field, first, connector);
    return result;
  }

  if (!field.card) {
    console.log("Ende Gelände");
    return result;
  }

  const nextConnectorIdx = +field.card[connector];
  let globalNext = coordIdx * 8 + nextConnectorIdx + 4;

  const nextConnector = connectors[nextConnectorIdx + 4];

  if (
    !isTerminal(field.i, field.j, coordIdx, connectors[nextConnectorIdx + 4])
  ) {
    globalNext += nextConnector.next;
    return mark(globalNext, result);
  } else {
    state.length = state.path.length;
    state.score =
      state.length *
      (isCenter(coordIdx, connectors[nextConnectorIdx + 4]) ? 2 : 1);
    result.push(globalNext);
    return result;
  }
};

state.starts = range(8)
  .flatMap((i) =>
    range(8).flatMap((j) => range(4).flatMap((c) => ({ i, j, c }))),
  )
  .filter((o) => isBoundary(o.i, o.j, o.i + o.j * 8, connectors[o.c]))
  .map((o) => (o.i + o.j * 8) * 8 + o.c);

const markMaxLength = () => {
  const lengths = state.starts.map((e, i) => ({
    e,
    length: mark(e).length,
  }));

  const maxLength = lengths.reduce(
    (acc, v) => (acc.length > v.length ? acc : v),
    { length: -1 },
  );

  state.path = mark(maxLength.e);
  console.log(maxLength);
  return maxLength;
};

const applyCards = (cards) => {
  cards.forEach((c, i) => {
    state.fields[i].card = c;
  });
};

const runs = [{ maxLength: { length: -1 } }];

const next = () => {
  state.cards = shuffle(state2.slice(0, state2.length));
  applyCards(state.cards);

  const candidate = markMaxLength();

  if (runs[runs.length - 1].maxLength.length < candidate.length)
    runs.push({
      cards: state.cards.join(","),
      maxLength: candidate,
    });

  console.log(runs);
};

const runIt = () => {
  range(100000).forEach(next);

  state.cards = runs[runs.length - 1].cards.split(",");
  applyCards(state.cards);
  markMaxLength();
  m.redraw();
};

m.mount(document.body, {
  view: (vnode) => [
    svg(
      {
        width: innerWidth,
        height: innerHeight,
      },
      text(
        { x: innerWidth / 2 - 100, y: innerHeight / 2, fill: "white" },
        JSON.stringify(state.length),
        " ",
        JSON.stringify(state.score),
      ),
      state.fields.map((c) =>
        m(card, {
          x: c.i,
          y: c.j,
          cardIdx: c.cardIdx,
          card: c.card,
        }),
      ),
    ),
    button(
      {
        onclick: (e) => next() || m.redraw(),
      },
      "Next",
    ),
    button(
      {
        onclick: (e) => runIt(),
      },
      "run it",
    ),
  ],
});
