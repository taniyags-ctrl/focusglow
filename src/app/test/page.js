"use client";
import { db } from "../../lib/firebase";

export default function TestFirebase() {
  const writeData = () => {
    db.ref("test").set({
      message: "Hello FocusGlow!"
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Firebase Connection Test</h2>
      <button onClick={writeData}>Send Test Data</button>
    </div>
  );
}
