import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { activeHomeAtom } from "../../store";
import Explore from "../../components/HomeTabs/Explore/Explore";
import Chats from "../../components/HomeTabs/Chats/Chats";
import Agents from "../../components/HomeTabs/Agents/Agents";
import Catalogue from "../../components/HomeTabs/Catalogue/Catalogue";
import Projects from "../../components/HomeTabs/Projects/Projects";
import Dashboard from "../../components/HomeTabs/Dashboard/Dashboard";
import Company from "../../components/HomeTabs/Company/Company";

const Home = () => {
  const [activeHomeComp, setActiveHomeComp] = useRecoilState(activeHomeAtom);

  useEffect(() => {
    setActiveHomeComp(0);
  }, []);

  const homeTabs = [
    {
      name: "Explore",
      component: <Explore />,
    },
    {
      name: "Company Dashboard",
      component: <Company />,
    },
    // {
    //   name: "Your Chats",
    //   component: <Chats />,
    // },
    // {
    //   name: "Your Live Agents",
    //   component: <Agents />,
    // },
    // {
    //   name: "Your Catalogue",
    //   component: <Catalogue />,
    // },
    // {
    //   name: "Your Projects",
    //   component: <Projects />,
    // },
    // {
    //   name: "Your Dashboard",
    //   component: <Dashboard />,
    // },
  ];
  return (
    <div>
      <div className="flex justify-between items-center pl-1 pr-4 pt-2">
        {homeTabs.map((tab, index) => (
          <div
            key={index}
            className={`${
              activeHomeComp == index
                ? "text-white bg-[#E07E65]"
                : "bg-gray-300 font-semibold"
            } flex justify-center items-center border ${
              index == homeTabs.length - 1 ? "rounded-r-md" : "border-r-black"
            } ${
              index == 0 ? "rounded-l-md" : ""
            } px-2 py-1 text-sm cursor-pointer flex-1`}
            onClick={() => setActiveHomeComp(index)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="h-[80vh] w-full pl-1 pr-4">
        {homeTabs[activeHomeComp].component}
      </div>
    </div>
  );
};

export default Home;
