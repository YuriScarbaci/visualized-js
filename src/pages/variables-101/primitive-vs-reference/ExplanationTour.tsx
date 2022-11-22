import React, { useState } from "react";
import Joyride, { STATUS, type Step } from "react-joyride";
import SyntaxHighlighter, { createElement } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { uid } from "uid";
import "./ExplanationTour.scss";

const tourStepsCbs = React.createRef() as React.MutableRefObject<
  ((joyrideStartIndex: number) => void)[]
>;
tourStepsCbs.current = [];

const rowWithTour: React.ComponentProps<
  typeof SyntaxHighlighter
>["renderer"] = (props) => {
  const { rows, stylesheet, useInlineStyles } = props;

  return (
    <>
      {rows.map((node, index) => (
        <span className="syntax-line-wrapper" key={uid(6)}>
          {createElement({
            node,
            stylesheet,
            useInlineStyles,
            key: `row-${uid(6)}`,
          })}
          <button
            className="btn btn-outline-info"
            type="button"
            onClick={() => {
              tourStepsCbs?.current?.[index]?.(index);
            }}
          >
            <i className="ri-question-line" />
          </button>
        </span>
      ))}
    </>
  );
};

const genVarName = (isPrimitive: boolean, length = 3) => {
  let result = isPrimitive ? "primitive" : "reference";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const char = characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
    result += i === 0 ? char.toUpperCase() : char;
  }
  return result;
};

const genRanHex = (size = 4) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")
    .toUpperCase();

const genRanPrimitive = () => {
  const typeInt = Math.floor(Math.random() * 4);
  switch (typeInt) {
    case 1:
      return `${Math.random().toString(36).slice(2, 7)}`;
    case 2:
      return `${Math.floor(Math.random() * 10000)}`;
    case 3:
      return `${Math.random() < 0.5}`;
    default:
      return "null";
  }
};
const genRanReference = () => {
  const typeInt = Math.floor(Math.random() * 3);
  switch (typeInt) {
    case 1:
      return `()=>{}`;
    case 2:
      return `[]`;
    case 3:
    default:
      return `{}`;
  }
};
const linePropsGenerator = (lineN: number) =>
  ({
    id: `variable-code-block-line-${lineN - 1}`,
  } as React.HTMLProps<HTMLElement>);
type MemoryAddressRapresentation = {
  address: string;
  val: string;
  varName?: string;
  heapIndex?: number;
};
const createTourStarter =
  (stackValues: {
    ram: MemoryAddressRapresentation;
    heap: MemoryAddressRapresentation;
    setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  }) =>
  (joyrideStartIndex: number) => {
    const {
      ram: { address: ramAddress, heapIndex, varName, val: ramVal },
      heap: { address: heapAddress, val: heapVal },
      setSteps,
    } = stackValues;
    const isReference = heapIndex !== undefined && heapIndex >= 0;
    const newSteps: Step[] = [
      {
        target: `#variable-code-block-line-${joyrideStartIndex}`,
        content:
          "Let's take a deeper look at what this instruction is doing behind the scene",
        disableBeacon: true,
      },
    ];
    if (isReference) {
      newSteps.push({
        target: `#variable-code-block-line-${joyrideStartIndex}`,
        content:
          "When the javascript engine reads this line it understand you want to store a 'complex' information in memory",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .address`,
        content:
          "The first thing that javascript will do is create a new ram slot for your variable",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .value`,
        content:
          "Since this is a complex information, javascript will NOT store the value 'as-is', it will create a 'reference' to another memorystack and store the link between the stacks",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.heap-${heapAddress} .address`,
        content:
          "Notice how the link is established, ram 'value' points to heap 'address'",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.heap-${heapAddress} .value`,
        content: "Finally the value will be stored in the heap",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.visualizer-wrapper`,
        content:
          "This peculiar way of automatic handling the variables has some non immediate-to-catch consequencies",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.visualizer-wrapper`,
        content:
          "Let's see what happens when we try some boolean logic with the `===` operator",
        disableBeacon: true,
      });
      newSteps.push({
        target: `.visualizer-wrapper`,
        content: (
          <pre>
            {varName} === {heapVal}
          </pre>
        ),
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .address`,
        content: (
          <div>
            <pre>{varName} === ...</pre>
            <br />
            the right side of this operation will search for the ram address
          </div>
        ),
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .address`,
        content: `${varName} === ... \n it will then convert it's ram address to it's ram value equivalent`,
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .value`,
        content: `${ramVal} === ... \n it will then proceed to the right side of the operator`,
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress} .value`,
        content: `... === ${heapVal} \n since ${heapVal} is a reference variable, it will create an anonymous temporary reference in the ram and apply the same proccess`,
        disableBeacon: true,
      });
      let anonymAddress = `Heap -> 0x${genRanHex(4)}`;
      newSteps.push({
        target: `.ram-${ramAddress}`,
        content: `... === ${anonymAddress} \n right side ends up becoming a ram address too`,
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress}`,
        content: `${ramVal} === ${anonymAddress} \n finally evaluation will look like this to javascript`,
        disableBeacon: true,
      });
      newSteps.push({
        target: `.ram-${ramAddress}`,
        content: `${ramVal} === ${anonymAddress} \n this would evaluate to false`,
        disableBeacon: true,
      });
    } else {
    }

    console.log("setSteps", setSteps);
    console.log("newSteps", newSteps);
    console.log("stackValues", stackValues);
    setSteps(newSteps);
  };

export const ExplanationTour = () => {
  const [tourSteps, setTourSteps] = React.useState<Step[]>([]);
  const javascriptCodeLines = React.useRef<string[]>([]);
  const [stacks, setStacks] = React.useState<{
    ram: MemoryAddressRapresentation[];
    heap: MemoryAddressRapresentation[];
  }>({ ram: [], heap: [] });
  const storePrimitive = React.useCallback((val: string) => {
    const address = `0x${genRanHex(4)}`;
    const varName = genVarName(true);
    const ramAddr = { address, val, varName };
    setStacks(({ ram: oldRam, heap: oldHeap }) => ({
      ram: [...oldRam, ramAddr],
      heap: [...oldHeap],
    }));
    javascriptCodeLines.current.push(`const ${varName}= ${val};`);
  }, []);
  const storeReference = React.useCallback((newVal: string) => {
    const varName = genVarName(false);
    const ramAddress = `0x${genRanHex(4)}`;
    const heapAddress = `0x${genRanHex(4)}`;
    setStacks(({ ram: oldRam, heap: oldHeap }) => {
      const heapAddr = { address: heapAddress, val: newVal, varName };
      const newHeap = [...oldHeap, heapAddr];
      const ramAddr = {
        address: ramAddress,
        val: `Heap -> ${heapAddress}`,
        varName,
        heapIndex: newHeap.length - 1,
      };
      const newRam = [...oldRam, ramAddr];
      tourStepsCbs.current.push(
        createTourStarter({
          ram: ramAddr,
          heap: heapAddr,
          setSteps: setTourSteps,
        })
      );
      return {
        ram: newRam,
        heap: newHeap,
      };
    });
    javascriptCodeLines.current.push(`const ${varName}= ${newVal};`);
  }, []);
  const newPrimitive = React.useCallback(
    () => storePrimitive(genRanPrimitive()),
    [storePrimitive]
  );
  const newReference = React.useCallback(
    () => storeReference(genRanReference()),
    []
  );

  const resetTour = React.useCallback(() => {
    const [firstStep] = tourSteps;
    // if reference, we need to remove ram/heap last record
    setStacks(({ ram: oldRam, heap: oldHeap }) => ({
      ram: [...oldRam],
      heap: [...oldHeap],
    }));
    setTourSteps([]);
  }, []);
  console.log("tourSteps", tourSteps);
  return (
    <div className="RightSideRamContainer">
      <div className="ActionsZones">
        <button
          className="btn btn-primary"
          type="button"
          onClick={newPrimitive}
        >
          Store primitive
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={newReference}
        >
          Store Reference
        </button>
      </div>
      <div className="PreviewsZone">
        <div>
          <SyntaxHighlighter
            language={"javascript"}
            style={dark}
            showLineNumbers
            wrapLines
            lineProps={linePropsGenerator}
            renderer={rowWithTour}
          >
            {javascriptCodeLines.current.join("\n")}
          </SyntaxHighlighter>
        </div>
        <div className="visualizer-wrapper">
          <div>
            Ram:
            <div className="ram-stack">
              {stacks.ram.length === 0 ? <div>Ram is empty</div> : null}
              {stacks.ram.map(({ address, val, varName }, i) => (
                <div key={address} className={`item-wrap ram-${address}`}>
                  <div className={`address ram-${i}`}>
                    {address}({varName})
                  </div>
                  <div className={`value ram-${i}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            Heap:
            <div className="heap-stack">
              {stacks.heap.length === 0 ? <div>Heap is empty</div> : null}
              {stacks.heap.map(({ address, val }, i) => (
                <div key={address} className={`item-wrap heap-${address}`}>
                  <div className={`address heap-${i}`}>{address}</div>
                  <div className={`value heap-${i}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {tourSteps.length !== 0 ? (
        <Joyride
          steps={tourSteps}
          run={true}
          callback={(data) => {
            const { status } = data;
            if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
              // tour finished, reset the joy-ride
              resetTour();
            }
          }}
          continuous
        />
      ) : null}
    </div>
  );
};
