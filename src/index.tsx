import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useMachine } from "@xstate/react";
import { flightMachine } from "./flightMachine";
import { FlightInput } from "./FlightInput";
import { inspect } from "@xstate/inspect";

inspect({
  iframe: false,
  url: "https://stately.ai/viz?inspect"
});

const Flight = () => {
  const [state, send] = useMachine(flightMachine, { devTools: true });
  const { startDate, returnDate, trip } = state.context;

  const canSubmit = flightMachine.transition(state, "SUBMIT").changed;

  return (
    <section>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <select
          onChange={(e) => {
            send({ type: "SET_TRIP", value: e.target.value });
          }}
          value={trip}
        >
          <option value="oneWay">One way</option>
          <option value="roundTrip">Round trip</option>
        </select>
        <FlightInput
          value={startDate}
          onChange={(value) => send({ type: "startDate.UPDATE", value })}
          error={!startDate}
          label="Start date"
        />
        <FlightInput
          value={returnDate}
          onChange={(value) => send({ type: "returnDate.UPDATE", value })}
          error={!returnDate || returnDate <= startDate}
          disabled={trip === "oneWay"}
          label="Return date"
        />
        <button
          type="button"
          onClick={() => send("SUBMIT")}
          disabled={!canSubmit}
          data-state={state.toStrings().join(" ")}
        >
          {state.matches("editing") && "Submit"}
          {state.matches("submitted") && "Success!"}
        </button>
      </form>
    </section>
  );
};

const App = () => {
  return <Flight />;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
