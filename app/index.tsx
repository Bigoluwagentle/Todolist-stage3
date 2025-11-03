import "react-native-get-random-values";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import Home from "./Home";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <Home />
    </ConvexProvider>
  );
}
