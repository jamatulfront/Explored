import { Map, Marker } from "pigeon-maps";
export default function MapView() {
  return (
    <Map
      height={"100vh"}
      defaultCenter={[22.4644467, 90.3821097]}
      defaultZoom={11}
    >
      <Marker width={50} anchor={[22.4644467, 90.3821097]} />
    </Map>
  );
}
