import {useEffect, useState} from "react";
import {Innertube} from "../utils/Youtube";

const visitorDataKey = "visitorDataYT";

export default function useYoutube() {
  const [youtube, setYoutube] = useState<Innertube>();

  useEffect(() => {
    // let visitorData = Settings.get(visitorDataKey);
    // if (true) {
    //   visitorData = makeid(24);
    //   Settings.set({
    //     [visitorDataKey]: visitorData,
    //   });
    // }

    Innertube.create({
      lang: "de",
    })
      .then(setYoutube)
      .catch(console.warn);
  }, []);

  // useEffect(() => {
  //   // TODO: Check if visitorData is wanted
  //   if (youtube && true) {
  //     youtube.actions
  //       .execute("/visitor_id?key=AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8")
  //       .then(response => {
  //         console.log("VisitorData: ", JSON.stringify(response.data));
  //       });
  //   }
  // }, [youtube]);

  return youtube;
}

function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
