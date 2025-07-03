import React, { type JSX } from "react";

interface LLMResponseFormatterProps {
  response: string;
  className?: string;
}

const LLMResponseFormatter: React.FC<LLMResponseFormatterProps> = ({
  response,
  className = "",
}) => {
  // Parse the response text and convert it to formatted JSX
  const parseResponse = (text: string): React.ReactNode[] | null => {
    if (!text) return null;

    // Split by double newlines to get paragraphs/sections
    const sections = text.split(/\n\s*\n/);

    return sections
      .map((section, index) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return null;

        // Check if it's a code block
        if (trimmedSection.startsWith("```")) {
          return parseCodeBlock(trimmedSection, index);
        }

        // Check if it's a list section
        if (
          trimmedSection.includes("\n*") ||
          trimmedSection.includes("\n-") ||
          trimmedSection.includes("\n1.")
        ) {
          return parseList(trimmedSection, index);
        }

        // Check if it's a header
        if (trimmedSection.startsWith("#")) {
          return parseHeader(trimmedSection, index);
        }

        // Regular paragraph
        return (
          <p key={index} className="mb-4 text-gray-800 leading-relaxed">
            {parseInlineFormatting(trimmedSection)}
          </p>
        );
      })
      .filter(Boolean);
  };

  const parseCodeBlock = (text: string, index: number): React.ReactElement => {
    const lines = text.split("\n");
    const language = lines[0].replace("```", "").trim();
    const code = lines.slice(1, -1).join("\n");

    return (
      <div key={index} className="mb-6">
        {language && (
          <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b border-gray-200 font-mono">
            {language}
          </div>
        )}
        <pre className="bg-gray-50 p-4 overflow-x-auto border border-gray-200 rounded-b-md">
          <code className="text-sm font-mono text-gray-800 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    );
  };

  const parseList = (text: string, index: number): React.ReactElement => {
    const lines = text.split("\n");
    const items: string[] = [];
    let currentItem = "";
    let isNumbered = false;
    const preListElements: React.ReactElement[] = [];

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();

      // Check if it's a list item
      if (trimmed.match(/^[\*\-]\s/) || trimmed.match(/^\d+\.\s/)) {
        if (currentItem) {
          items.push(currentItem.trim());
        }
        isNumbered = trimmed.match(/^\d+\.\s/) ? true : isNumbered;
        currentItem = trimmed.replace(/^[\*\-]\s/, "").replace(/^\d+\.\s/, "");
      } else if (trimmed && currentItem) {
        // Continuation of previous item
        currentItem += " " + trimmed;
      } else if (trimmed && !currentItem) {
        // Text before list items
        preListElements.push(
          <p
            key={`${index}-pre-${lineIndex}`}
            className="mb-2 text-gray-800 leading-relaxed"
          >
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    if (currentItem) {
      items.push(currentItem.trim());
    }

    const ListComponent = isNumbered ? "ol" : "ul";
    const listClass = isNumbered
      ? "list-decimal list-inside mb-4 space-y-2"
      : "list-disc list-inside mb-4 space-y-2";

    return (
      <div key={index}>
        {preListElements}
        <ListComponent className={listClass}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-gray-800 leading-relaxed pl-2">
              {parseInlineFormatting(item)}
            </li>
          ))}
        </ListComponent>
      </div>
    );
  };

  const parseHeader = (
    text: string,
    index: number
  ): React.ReactElement | null => {
    if (!text.startsWith("#")) return null;

    const headerMatch = text.match(/^#+/);
    if (!headerMatch) return null;

    const level = headerMatch[0].length;
    const content = text.replace(/^#+\s*/, "");

    const headerClasses: Record<number, string> = {
      1: "text-2xl font-bold mb-4 mt-6 text-gray-900",
      2: "text-xl font-semibold mb-3 mt-5 text-gray-900",
      3: "text-lg font-semibold mb-3 mt-4 text-gray-800",
      4: "text-base font-semibold mb-2 mt-3 text-gray-800",
      5: "text-sm font-semibold mb-2 mt-3 text-gray-700",
      6: "text-sm font-semibold mb-2 mt-2 text-gray-700",
    };

    const clampedLevel = Math.min(level, 6);
    const HeaderTag = `h${clampedLevel}` as keyof JSX.IntrinsicElements;

    return React.createElement(
      HeaderTag,
      {
        key: index,
        className: headerClasses[clampedLevel],
      },
      parseInlineFormatting(content)
    );
  };

  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    // Create a more robust parsing system
    let currentText = text;

    // Process in order: code first (to avoid conflicts), then bold, then italic
    const patterns = [
      { type: "code" as const, regex: /`([^`]+)`/g },
      { type: "bold" as const, regex: /\*\*(.*?)\*\*/g },
      { type: "bold" as const, regex: /__(.*?)__/g },
      { type: "italic" as const, regex: /\*([^*]+)\*/g },
      { type: "italic" as const, regex: /_([^_]+)_/g },
    ];

    // Split text into segments with formatting info
    let segments: Array<{ text: string; formats: Set<string> }> = [
      { text: currentText, formats: new Set() },
    ];

    patterns.forEach((pattern) => {
      const newSegments: Array<{ text: string; formats: Set<string> }> = [];

      segments.forEach((segment) => {
        if (segment.formats.has(pattern.type)) {
          newSegments.push(segment);
          return;
        }

        const parts = segment.text.split(pattern.regex);
        let match;
        const matches: string[] = [];

        // Reset regex
        pattern.regex.lastIndex = 0;
        while ((match = pattern.regex.exec(segment.text)) !== null) {
          matches.push(match[1]);
        }

        if (matches.length === 0) {
          newSegments.push(segment);
          return;
        }

        let matchIndex = 0;
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // Regular text
            if (parts[i]) {
              newSegments.push({
                text: parts[i],
                formats: new Set(segment.formats),
              });
            }
          } else {
            // Formatted text
            if (matchIndex < matches.length) {
              const newFormats = new Set(segment.formats);
              newFormats.add(pattern.type);
              newSegments.push({
                text: matches[matchIndex],
                formats: newFormats,
              });
              matchIndex++;
            }
          }
        }
      });

      segments = newSegments;
    });

    // Convert segments to React elements
    return segments
      .map((segment, index) => {
        if (segment.formats.size === 0) {
          return segment.text;
        }

        let element: React.ReactNode = segment.text;

        if (segment.formats.has("code")) {
          element = (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
              {element}
            </code>
          );
        }

        if (segment.formats.has("bold")) {
          element = <strong>{element}</strong>;
        }

        if (segment.formats.has("italic")) {
          element = <em>{element}</em>;
        }

        return <React.Fragment key={index}>{element}</React.Fragment>;
      })
      .filter((segment) => segment !== "");
  };

  return (
    <div className={`max-w-none prose prose-gray ${className}`}>
      <div className="text-gray-800">{parseResponse(response)}</div>
    </div>
  );
};

export default LLMResponseFormatter;
