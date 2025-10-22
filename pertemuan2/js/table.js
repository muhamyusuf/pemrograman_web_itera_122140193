import { storage } from "./storage.js";

const getDevices = () => {
  const { devices = [] } = storage.load();
  return devices.map((device) => ({ ...device }));
};

const updateDevice = (id, updater) => {
  storage.update((snapshot) => {
    const nextDevices = snapshot.devices.map((device) =>
      device.id === id
        ? {
            ...device,
            ...(typeof updater === "function" ? updater(device) : updater),
          }
        : device,
    );
    return { ...snapshot, devices: nextDevices };
  });
};

export { getDevices, updateDevice };
