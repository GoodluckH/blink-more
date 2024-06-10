import { Button, Slider } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { useCallback, useEffect, useState } from "react";
import { usePiPWindow } from "~/PiP/PiPProvider";
import PiPWindow from "~/PiP/PiPWindow";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  const { isSupported, requestPipWindow, pipWindow, closePipWindow } =
    usePiPWindow();

  const startPiP = useCallback(() => {
    requestPipWindow(10, 1);
  }, [requestPipWindow]);

  const [isBlack, setIsBlack] = useState(false);
  const [blinksPerMinute, setBlinksPerMinute] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlack((prev) => !prev);
      setTimeout(() => setIsBlack((prev) => !prev), 700);
    }, (60 / blinksPerMinute) * 1000);
    return () => clearInterval(interval);
  }, [blinksPerMinute]);

  const backgroundColor = isBlack ? "red" : "green";

  return (
    <div className="w-full h-screen  flex flex-col  justify-center items-center">
      <div className="w-full max-w-lg h-full flex flex-col justify-center items-start">
        <div className="text-3xl font-black">Blink More</div>
        <div className="text-lg font-black/50 mb-10">
          Blinking more can help reduce eye strain and dryness. Start blinking
          more with this simple tool.
        </div>
        {isSupported ? (
          <div className="flex flex-col w-full justify-center items-center gap-5">
            <Slider
              label="Blinks Per Minute"
              step={5}
              maxValue={40}
              minValue={5}
              defaultValue={blinksPerMinute}
              value={blinksPerMinute}
              onChange={(value) => setBlinksPerMinute(value as number)}
              showSteps
              showOutline
              isDisabled={!pipWindow}
              color={pipWindow ? "success" : "foreground"}
              size="lg"
              className="w-full"
            />

            <Button
              onClick={pipWindow ? closePipWindow : startPiP}
              color={pipWindow ? "default" : "primary"}
            >
              {pipWindow ? "Close Pop-Out Window" : "Start Blinking More"}
            </Button>
            {pipWindow && (
              <PiPWindow pipWindow={pipWindow}>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    height: "100%",
                    backgroundColor,
                    transition: "background-color 0.2s ease-in-out",
                  }}
                />
              </PiPWindow>
            )}
          </div>
        ) : (
          <div className="error">
            Document Picture-in-Picture is not supported in this browser. We
            recommend using the latest version of Chrome.
          </div>
        )}
      </div>
    </div>
  );
}
