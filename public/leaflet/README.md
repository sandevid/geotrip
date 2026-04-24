# Leaflet Icons

This directory should contain the default Leaflet marker icons:

- `marker-icon.png` - Default marker icon (25x41px)
- `marker-icon-2x.png` - High-DPI version (50x82px)  
- `marker-shadow.png` - Marker shadow (41x41px)

These files can be copied from:
`node_modules/leaflet/dist/images/`

Or downloaded from the Leaflet repository:
https://github.com/Leaflet/Leaflet/tree/main/dist/images

## Usage

The FasilitasMap component references these icons to fix the default marker display issue with webpack bundling.

```typescript
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});
```