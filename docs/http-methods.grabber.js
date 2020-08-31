;$$('dt').map(({
  firstChild: {href, textContent},
  nextElementSibling: {textContent: description
}}) => ((code, title) => `| ${[
    href 
    ? `[${code}](${href})`
    : code,
    title,
    description
  ].join(" | ")} |`)(+textContent.slice(0, 3), textContent.slice(4))
).join("\n");
