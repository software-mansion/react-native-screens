import React, {forwardRef, useMemo} from "react";
import {VLCPlayer} from "react-native-vlc-media-player";

type Props = React.ComponentPropsWithRef<VLCPlayer>;

const VLCPlayerWrapper = forwardRef<VLCPlayer, Props>((props, ref) => {
  // Disable rerender to not cause any errors

  return useMemo(() => <VLCPlayer {...props} ref={ref} />, []);
});

export default VLCPlayerWrapper;
