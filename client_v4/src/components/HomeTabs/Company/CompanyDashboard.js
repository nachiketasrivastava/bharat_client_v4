import React from "react";
import Box from "./Box";
import Line from "./Line";
import ConversionRate from "./ConversionRate";
import MiddleLine from "./MiddleLine";
import UpperLine from "./UpperLine";
import MiddleUpperLine from "./MiddleUpperLine";
import ConversionUpperRate from "./ConversionUpperRate";

import { useRecoilValue } from "recoil";
import { activeCompanyAtom } from "../../../store";

const App = () => {
  const activeCompany = useRecoilValue(activeCompanyAtom);

  const boxes = [
    {
      name: "Identified",
      value: 5000,
    },
    {
      name: "Interested",
      value:
        activeCompany === 0     // All Channels
          ? 1000
          : activeCompany === 1 // Customer Webinar
          ? 211
          : activeCompany === 2 // Linkedin
          ? 198
          : activeCompany === 3 // Referral
          ? 181
          : activeCompany === 4 // Webinar
          ? 213
          : 197                 // Website
    },
    {
      name: "Engaged",
      value:
      activeCompany === 0     // All Channels
        ? 614
        : activeCompany === 1 // Customer Webinar
        ? 128
        : activeCompany === 2 // Linkedin
        ? 123
        : activeCompany === 3 // Referral
        ? 115
        : activeCompany === 4 // Webinar
        ? 128
        : 120                 // Website
    },
    {
      name: "Priority",
      value: activeCompany === 0     // All Channels
        ? 237
        : activeCompany === 1 // Customer Webinar
        ? 43
        : activeCompany === 2 // Linkedin
        ? 39
        : activeCompany === 3 // Referral
        ? 52
        : activeCompany === 4 // Webinar
        ? 55
        : 48                 // Website
    },
    {
      name: "Committed",
      value: activeCompany === 0     // All Channels
        ? 167
        : activeCompany === 1 // Customer Webinar
        ? 28
        : activeCompany === 2 // Linkedin
        ? 31
        : activeCompany === 3 // Referral
        ? 34
        : activeCompany === 4 // Webinar
        ? 34
        : 40                 // Website
    },
    {
      name: "First Impact",
      value: activeCompany === 0     // All Channels
        ? 74
        : activeCompany === 1 // Customer Webinar
        ? 13
        : activeCompany === 2 // Linkedin
        ? 15
        : activeCompany === 3 // Referral
        ? 14
        : activeCompany === 4 // Webinar
        ? 15
        : 17                 // Website
    },
    {
      name: "Recurring Impact",
      value: activeCompany === 0     // All Channels
        ? 38
        : activeCompany === 1 // Customer Webinar
        ? 10
        : activeCompany === 2 // Linkedin
        ? 10
        : activeCompany === 3 // Referral
        ? 6
        : activeCompany === 4 // Webinar
        ? 6
        : 6                 // Website
    },
    {
      name: "Retention",
      value: activeCompany === 0     // All Channels
        ? 26
        : activeCompany === 1 // Customer Webinar
        ? 6
        : activeCompany === 2 // Linkedin
        ? 10
        : activeCompany === 3 // Referral
        ? 3
        : activeCompany === 4 // Webinar
        ? 4
        : 3                 // Website
    },
    {
      name: "Expansion",
      value: activeCompany === 0     // All Channels
        ? 6
        : activeCompany === 1 // Customer Webinar
        ? 3
        : activeCompany === 2 // Linkedin
        ? 2
        : activeCompany === 3 // Referral
        ? 0
        : activeCompany === 4 // Webinar
        ? 0
        : 1                 // Website
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: "13rem",
        paddingBottom: "10rem",
        gap: "2rem",
      }}
    >
      {boxes.map(({ name, value }, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box label={name} value={value} index={index} />
          <Line index={index} />
          {(index === 4 || index === 5 || index === 2 || index === 7) && (
            <>
              <UpperLine index={index} />
              {index !== 7 && (
                <>
                  <MiddleUpperLine index={index} />
                  {index === 2 && (
                    <ConversionUpperRate
                      rate={((boxes[4].value / boxes[2].value) * 100).toFixed(
                        2
                      )}
                      type={"rate"}
                      index={index}
                    />
                  )}
                  {/* <ConversionUpperRate rate={"▵t"} type={"▵t"} index={index} /> */}
                </>
              )}
            </>
          )}
          {index < boxes.length - 1 && (
            <>
              <MiddleLine />
              <ConversionRate
                rate={(
                  (boxes[index + 1].value / boxes[index].value) *
                  100
                ).toFixed(2)}
                type={"rate"}
              />
              {/* <ConversionRate rate={"▵t"} type={"▵t"} /> */}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
