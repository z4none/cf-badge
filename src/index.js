export default {
  async fetch(request) {
    return await handleRequest(request);
  },
};

//
function generateBadge(subject, value, color) {
  const textLenght = (subject + value).length;
  const subjectLengt = ((subject.length + 4) / (textLenght + 8)) * 100;
  const valueLength = ((value.length + 4) / (textLenght + 8)) * 100;
  const fontSize = _getFontSize(textLenght);
  const borderRadius = 0;

  return generateBadgeSVG({
    borderRadius,
    subject,
    value,
    subjectLengt,
    valueLength,
    subjectColor: '#323B34',
    valueColor: color,
    fontSize
  });
}

//
function generateBadgeSVG({
  borderRadius = 4,
  fontSize = 9,
  height = 20,
  subject,
  subjectColor,
  subjectLengt,
  subjectTextColor = '#FFF',
  value,
  valueColor,
  valueLength,
  valueTextColor = '#FFF',
  width = 100,
}) {
  return `
  <svg style="border-radius: ${borderRadius}px" viewBox="0 0 ${width} ${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="0" y="0" width="${subjectLengt}" height="${height}" fill="${subjectColor}" />
      <text font-size="${fontSize}px" font-weight="100" font-family="sans-serif" fill="${subjectTextColor}" x="${subjectLengt * 0.5}" y="55%" alignment-baseline="middle" text-anchor="middle">${subject}</text>
    </g>
    <g>
      <rect x="${subjectLengt}" y="0" width="${valueLength}" height="${height}" fill="${valueColor}" />
      <text font-size="${fontSize}px" font-weight="100" font-family="sans-serif" fill="${valueTextColor}"  x="${width - (valueLength / 2)}" y="55%" alignment-baseline="middle" text-anchor="middle">${value}</text>
    </g>
  </svg>
  `;
};

//
function _getFontSize(length) {
  if (length < 10) {
    return 12;
  }
  if (length < 13) {
    return 11;
  }
  if (length < 16) {
    return 10;
  }
  if (length < 20) {
    return 9;
  }
  if (length < 25) {
    return 8;
  }
  return 7;
}

//
async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  const perfix = "/badge";

  if (pathname.startsWith(perfix)) {
    const path = pathname.substr(perfix.length);
    let count = +await counter.get(path);
    count += 1;
    counter.put(path, count)
    return new Response(generateBadge("visited", `${count}`, '#3b82f6'), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  if (pathname.startsWith("/status")) {
    const httpStatusCode = Number(pathname.split("/")[2]);

    return Number.isInteger(httpStatusCode)
      ? fetch("https://http.cat/" + httpStatusCode)
      : new Response("That's not a valid HTTP status code.");
  }

  const html = `<!DOCTYPE html>
<body>
  <h1>It works!</h1>
  <img src="/badge/hello"/>
</body>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}