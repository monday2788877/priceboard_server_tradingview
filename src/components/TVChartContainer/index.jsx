import React, { useEffect, useRef } from "react";
import "./index.css";
import { widget } from "../../charting_library";
const { REACT_APP_CONNECTION_API } = process.env;
function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
export const TVChartContainer = () => {
  const chartContainerRef = useRef();

  const defaultProps = {
    symbol: "DIG",
    interval: "D",
    datafeedUrl: REACT_APP_CONNECTION_API,
    libraryPath: "/trading-view/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tpbs.com.vn",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    const widgetOptions = {
      //symbol: defaultProps.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        defaultProps.datafeedUrl
      ),
      //interval: defaultProps.interval,
      container: chartContainerRef.current,
      container_id: "tv_chart_container",
      library_path: defaultProps.libraryPath,

      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: [],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      timezone: "Asia/Bangkok",
      theme: getParameterByName("theme") || "dark",

      symbol: getParameterByName("symbol") || "VNINDEX",
      interval: getParameterByName("interval") || "D",
      symbol_search_complete: (symbol, searchResultItem) => {
        return new Promise((resolve) => {
          localStorage.setItem("tradingview_symbol", symbol);
          resolve(searchResultItem);
        });
      },
    };

    const tvWidget = new widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  });

  return (
    <div
      id="tv_chart_container"
      ref={chartContainerRef}
      className={"TVChartContainer"}
    />
  );
};
