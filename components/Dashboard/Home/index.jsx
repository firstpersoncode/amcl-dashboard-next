import { Grid, Typography } from "@mui/material";
import Count from "./Count";

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Selamat datang
      </Typography>

      <Grid container spacing={2}>
        <Grid item>
          <Count
            title="Jumlah Sekolah terdaftar"
            dataCountEndpoint="/api/school/count"
          />
        </Grid>

        <Grid item>
          <Count
            title="Jumlah Peserta terdaftar"
            dataCountEndpoint="/api/participant/count"
          />
        </Grid>
      </Grid>
    </>
  );
}
