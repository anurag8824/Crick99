import React, { MouseEvent } from "react";
import { isMobile } from "react-device-detect";
import { selectCasinoMatchList } from "../../redux/actions/casino/casinoSlice";
import { useAppSelector } from "../../redux/hooks";
import ICasinoMatch from "../../models/ICasinoMatch";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "./newcitem2.css";
const CasinoListItem2 = (props: any) => {
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  const navigate = useNavigateCustom();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [games, setGames] = React.useState<any>([]);

  React.useEffect(() => {
    const gamesfilter = gamesList.filter(
      (Item: any) =>
        Item.title.includes(category) || category == "All Casino" || !category
    );
    setGames(gamesfilter);
  }, [gamesList, category]);

  const onCasinoClick = (
    e: MouseEvent<HTMLAnchorElement>,
    Item: ICasinoMatch
  ) => {
    e.preventDefault();
    if (!Item.isDisable && Item.match_id != -1)
      navigate.go(`/casino/${Item.slug}/${Item.match_id}`);
    else toast.warn("This game is suspended by admin, please try again later");
  };
  return (
    <>
      {games &&
        games
          .filter((item: any) => !item.isDisable && item.match_id !== -1)
          .map((Item: any, key: number) => {
            return (
              
              // <div className="">
                  <a className="game-card-casino" key={key}  onClick={(e) => onCasinoClick(e, Item)} title={Item.title}>
                    <div className="game-image-container">
                      <img
                        src={Item.image}
                        alt={Item.image}
                        className="game-image"
                       />
                      <div className="game-overlay">
                        <span className="play-now">Play Now</span>
                      </div>
                    </div>
                    <div className="game-info">
                      <div>{Item.title}</div>
                    </div>
                  </a>
                // </div>
            );
          })}

      {/* <div className="games-grid-casino">
        <a className="game-card" key={key} href="/app/casino/dt20">
          <div className="game-image-container">
            <img
              src="	https://crick99.in/static/media/aaaa.15f68e1a30325d70bb2e.webp"
              alt="Dragon Tiger"
              className="game-image"
            />
            <div className="game-overlay">
              <span className="play-now">Play Now</span>
            </div>
          </div>
          <div className="game-info">
            <h3>Dragon Tiger</h3>
          </div>
        </a>
      </div> */}
    </>
  );
};
export default React.memo(CasinoListItem2);
