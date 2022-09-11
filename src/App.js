import { useState } from "react";
import "./App.css";
import ImportProject from "./ImportProject/ImportProject";
import { Box, TextField } from "@mui/material";

function App() {
  const [token, setToken] = useState("");
  const [storageUrl, setStorageUrl] = useState("");

  return (
    <div className="App">
      <ImportProject url={storageUrl} token={token} />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          multiline={true}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          label="Token"
        />
        <TextField
          value={storageUrl}
          onChange={(e) => setStorageUrl(e.target.value)}
          label="Storage URL"
        />
      </Box>
    </div>
  );
}

export default App;
