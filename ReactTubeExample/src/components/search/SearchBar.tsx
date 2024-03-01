import {SearchBar as RNSearchBar} from "@rneui/base";
import React, {useState} from "react";

interface Props {
  onSubmit: (text: string) => void;
}

export default function SearchBar({onSubmit}: Props) {
  const [query, setQuery] = useState("");

  return (
    <RNSearchBar
      returnKeyType={"search"}
      onChangeText={setQuery}
      value={query}
      onSubmitEditing={() => {
        console.log("Submit");
        onSubmit(query);
      }}
    />
  );
}
