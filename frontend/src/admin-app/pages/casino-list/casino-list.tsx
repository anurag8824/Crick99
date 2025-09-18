import React, { MouseEvent } from "react";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { isMobile } from "react-device-detect";
import ICasinoMatch from "../../../models/ICasinoMatch";
import casinoService from "../../../services/casino.service";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";

const CasinoList = () => {
  const [casinoList, setCasinoList] = React.useState<ICasinoMatch[]>([]);

  React.useEffect(() => {
    casinoService
      .getCasinoList()
      .then((res: AxiosResponse<{ data: ICasinoMatch[] }>) => {
        setCasinoList(res.data.data);
      });
  }, []);

  const onChecked = (
    e: MouseEvent<HTMLInputElement>,
    item: ICasinoMatch,
    index: number
  ) => {
    const items = [...casinoList];
    items[index] = { ...item, isDisable: !item.isDisable };
    setCasinoList(items);
    casinoService
      .disableCasino(`${item.match_id}`)
      .then((res: AxiosResponse<{ data: ICasinoMatch[]; message: any }>) => {
        // console.log(res,"fdfddf")
        toast.success("Game Updated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        //
      });
  };

  console.log(casinoList, "transaction data");
  const allowedMatchIds = [
    24, 36, 11, 9, 27, 26, 13, 40, 25, 37, 39, 29, 17, 18, 44,
  ];

  const TransactionData = casinoList.length ? (
    casinoList
      .filter((item: any) => allowedMatchIds.includes(item.match_id))
      .map((item: ICasinoMatch, index: number) => {
        return (
          <tr key={index}>
            <td className="text-center">{index + 1}</td>

            <td style={{ color: "#1890ff" }} className="text-center">
              {item.title}
            </td>
            <td className="text-center wnwrap">{item.slug}</td>
            {/* <td className="text-center wnwrap">
              {new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // 👈 ensures AM/PM
                timeZone: "Asia/Kolkata", // 👈 force IST timezone
              })}
            </td> */}

            <td className={`text-center wnwrap flex items-center gap-2`}>
              <input
                type={"checkbox"}
                checked={item.isDisable}
                onClick={(e) => onChecked(e, item, index)}
              />
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan={8} style={{ textAlign: "center" }}>
        No Result Found
      </td>
    </tr>
  );
  return (
    <>
      <div className="container-fluid p-4">
        <div
          style={{ background: "#0f2327" }}
          className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
        >
          <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
            Casino List
          </span>
          <CustomLink
            to={"/"}
            type="button"
            className="btn bg-primary text-white"
          >
            <span>Back</span>
          </CustomLink>
        </div>
        <div className="row">
          <div
            className={
              !isMobile ? "col-md-12 mt-1" : "col-md-12 padding-custom"
            }
          >
            <div className="">
              <div className="card-body">
                <div className="table-responsive">
                  <table id="customers1">
                    <thead>
                      <tr>
                        <th
                          style={{ backgroundColor: "#0f2327" }}
                          className="text-center wnwrap"
                        >
                          Code
                        </th>
                        <th
                          style={{ backgroundColor: "#0f2327" }}
                          className="text-center wnwrap"
                        >
                          Name
                        </th>
                        <th
                          style={{ backgroundColor: "#0f2327" }}
                          className="text-center wnwrap"
                        >
                          Slug
                        </th>
                        {/* <th
                          style={{ backgroundColor: "#0f2327" }}
                          className="text-center wnwrap"
                        >
                          Date
                        </th> */}
                        <th
                          style={{ backgroundColor: "#0f2327" }}
                          className="text-center wnwrap"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>{TransactionData}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CasinoList;
