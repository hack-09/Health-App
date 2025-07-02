export function parseLabReport(text) {
  const lines = text.split("\n").map(line => line.trim()).filter(line => line);

  const results = [];

  const knownParams = [
    "Platelet count", "Mean Cell Volume", "Mean Cell Haemoglobin",
    "Mean Cell Haemoglobin Concentration", "RDW",
    "Neutrophils", "Lymphocytes", "Eosinophils", "Monocytes", "Basophils"
  ];

  lines.forEach(line => {
    // Try to match known parameter in line
    const matchParam = knownParams.find(param => line.toLowerCase().includes(param.toLowerCase()));
    if (!matchParam) return;

    // Extract numbers from line
    const numbers = line.match(/[\d.]+/g);
    if (!numbers || numbers.length < 2) return;

    const value = parseFloat(numbers[0]);
    const rangeMatch = line.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
    let status = "Normal";
    let range = "N/A";

    if (rangeMatch) {
      const low = parseFloat(rangeMatch[1]);
      const high = parseFloat(rangeMatch[2]);
      range = `${low} - ${high}`;
      if (!isNaN(value) && (value < low || value > high)) {
        status = "Needs Attention ⚠️";
      }
    }

    const unitMatch = line.match(/Lakhs\/Cumm|pg|g\/L|fI|%/);
    const unit = unitMatch ? unitMatch[0] : "";

    results.push({
      parameter: matchParam,
      value,
      unit,
      range,
      status
    });
  });

  return results;
}
