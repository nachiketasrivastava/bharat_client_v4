import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
// import './AgentCSVList.css'
import logo from "../../assets/images/logoWOname.png";
import { jwtDecode } from "jwt-decode";
import { Button } from "antd";


const AgentCSVList = () => {
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  return (
      <div className={`w-[100%] mt-[10%] flex justify-center items-center h-[75%]`}>
        <div className="p-10 gap-10 flex justify-center flex-col bg-[whitesmoke] w-[70%] mt-[-50px] h-[200px]" style={{borderRadius: "80px", border: "0.5px solid grey"}}>
            <div className="gap-8 justify-center flex items-center " >
                <img
                  src={logo}
                  alt="brand-logo"
                  width={55}
                  className="mt-1"
                />
                <div className="text-[17px] font-[500]">
                    <p>
                      Hey Navigator! Thank you for submitting your lead generation criteria, enabling the agent to generate new leads for you.
                    </p>
                    <p className="mt-4">
                      {/* To get your first lead agent launched please  press continue below and give us your ICP and persona definitions. */}
                      This space helps you find the most relevant leads, automatically and persistently curated by your agent.
                    </p>
                    <p className="mt-4">
                      {/* To get your first lead agent launched please  press continue below and give us your ICP and persona definitions. */}
                      Leads will appear based on the frequency you set for the agent to curate them, and are tailored to your ICP definition and predefined triggers.
                    </p>
                </div>
            </div>
            {/* <div className="flex justify-center">
                <Button>Define ICP</Button>
            </div> */}
        </div>
      </div>
  )
};

export default AgentCSVList;