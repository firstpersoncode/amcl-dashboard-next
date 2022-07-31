import { parse } from "next-useragent";

export default function parseUserAgent(source) {
  const parsedUa = parse(source);

  const userAgent = {
    source,
    deviceType: parsedUa.deviceType || null,
    deviceVendor: parsedUa.deviceVendor || null,
    os: parsedUa.os || null,
    osVersion: parsedUa.osVersion || null,
    browser: parsedUa.browser || null,
    browserVersion: parsedUa.browserVersion || null,
    isBot: parsedUa.isBot,
  };

  return userAgent;
}
