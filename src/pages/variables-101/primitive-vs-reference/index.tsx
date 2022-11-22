import React from "react";
import { Intro } from "./Intro";
import { ExplanationTour } from "./ExplanationTour";
import "./primitiveVsReference.scss";

export const PrimitiveVsReference: React.ComponentType = () => {
  return (
    <div className="primitiveVsReferenceWrapper">
      <ExplanationTour />
      <Intro />
    </div>
  );
};
