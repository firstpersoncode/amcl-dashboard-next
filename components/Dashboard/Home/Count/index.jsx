import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Loader from "./Loader";
import axios from "axios";

export default function Count({ dataCountEndpoint, title }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.post(dataCountEndpoint, {});
        if (res?.data.count) setCount(res?.data.count);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [dataCountEndpoint]);

  return (
    <Card elevation={4}>
      {isLoading && <Loader />}
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Typography variant="h5" component="div">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}
