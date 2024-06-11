import React from "react";
import { PartitionOutlined, MenuOutlined, TeamOutlined, ClockCircleFilled, EditFilled } from '@ant-design/icons'

const CatalogueNavbar = () => {
  const catalogueTabs = [
    {
      name: "All",
      component: "",
    },
    {
      name: "Channels",
      component: <PartitionOutlined />,
    },
    {
      name: "Segment",
      component: <MenuOutlined />,
    },
    {
      name: "Team",
      component: <TeamOutlined />,
    },
    {
      name: "Time Period",
      component: <ClockCircleFilled />,
    },
    {
        name: "Edit Funnel",
        component: <EditFilled />,
      },
  ];
  return (
    <div className="flex justify-between items-center px-32 pt-10">
      {catalogueTabs.map((tab, index) => (
        <div
          key={index}
          className={`${
            index == 1 ? "text-white bg-[#E07E65]" : "bg-gray-300 font-semibold"
          } flex justify-center items-center gap-2 border ${
            index == catalogueTabs.length - 1
              ? "rounded-r-md"
              : "border-r-black"
          } ${index == 0 ? "rounded-l-md" : ""} px-2 py-1 text-sm flex-1`}
          // onClick={() => setActiveHomeComp(index)}
        >
          <div>{tab.component}</div>
          <div>{tab.name}</div>
        </div>
      ))}
    </div>
  );
};

export default CatalogueNavbar;
