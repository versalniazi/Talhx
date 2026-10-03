import { COMPANY, addressLines } from "@/data/site";

/** Company identification block used in legal pages. */
export function CompanyBlock() {
  return (
    <p>
      <strong>{COMPANY.legalName}</strong>
      <br />
      Company number: {COMPANY.companyNumber} (registered in {COMPANY.registeredIn})
      <br />
      Registered office: {addressLines.join(", ")}
    </p>
  );
}
