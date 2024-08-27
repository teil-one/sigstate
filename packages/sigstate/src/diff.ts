export function diff(
  newValues: Map<string, unknown>,
  oldValues: Map<string, unknown> | undefined,
) {
  if (!oldValues) {
    return newValues;
  }

  const result = new Map<string, unknown>();
  for (const signalName of newValues.keys()) {
    const newValue = newValues.get(signalName);

    // TODO: Handle arrays
    if (newValue !== oldValues.get(signalName)) {
      result.set(signalName, newValue);
    }
  }

  return result;
}
