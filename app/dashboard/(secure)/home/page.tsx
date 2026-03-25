import { updateContactAction, updateHomeAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings, normalizeContactSettings } from "@/lib/db";

const inputClassName = "rounded-lg border border-[var(--line)] px-3 py-2";

export default async function DashboardHomePage() {
  await requirePermission("home");
  const settings = await getSiteSettings();
  const data = {
    home: settings.home,
    contact: normalizeContactSettings(settings.contact),
  };

  return (
    <div className="grid gap-6">
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Edit Home Content</h1>
        <form action={updateHomeAction} className="mt-4 grid gap-3">
          <input name="headline" defaultValue={data.home.headline} className={inputClassName} />
          <textarea name="subheadline" defaultValue={data.home.subheadline} rows={3} className={inputClassName} />

          <div className="grid gap-3 md:grid-cols-2">
            <input name="primaryCtaText" defaultValue={data.home.primaryCtaText} placeholder="Primary CTA Text" className={inputClassName} />
            <input name="primaryCtaLink" defaultValue={data.home.primaryCtaLink} placeholder="Primary CTA Link" className={inputClassName} />
            <input name="secondaryCtaText" defaultValue={data.home.secondaryCtaText} placeholder="Secondary CTA Text" className={inputClassName} />
            <input name="secondaryCtaLink" defaultValue={data.home.secondaryCtaLink} placeholder="Secondary CTA Link" className={inputClassName} />
          </div>

          <h2 className="mt-2 text-lg font-bold">Stats</h2>
          {data.home.stats.map((stat, idx) => (
            <div key={idx} className="grid gap-3 md:grid-cols-2">
              <input name={`stat${idx + 1}Label`} defaultValue={stat.label} placeholder="Label" className={inputClassName} />
              <input name={`stat${idx + 1}Value`} defaultValue={stat.value} placeholder="Value" className={inputClassName} />
            </div>
          ))}

          <button className="button button-primary w-fit">Save Home</button>
        </form>
      </article>

      <article className="card p-6">
        <h2 className="text-2xl font-extrabold">Contact And Footer Settings</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Update the public contact page, footer details, top contact strip, map links, and social links from here.
        </p>

        <form action={updateContactAction} className="mt-6 grid gap-6">
          <section className="grid gap-3">
            <h3 className="text-lg font-bold">Main Contact Details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="address" defaultValue={data.contact.address} placeholder="Address" className={inputClassName} />
              <input name="city" defaultValue={data.contact.city} placeholder="City" className={inputClassName} />
              <input name="phone" defaultValue={data.contact.phone} placeholder="Phone" className={inputClassName} />
              <input name="email" defaultValue={data.contact.email} placeholder="Email" className={inputClassName} />
              <input name="mapUrl" defaultValue={data.contact.mapUrl} placeholder="Embedded map URL" className={inputClassName} />
              <input name="mapLinkUrl" defaultValue={data.contact.mapLinkUrl} placeholder="Map button link URL" className={inputClassName} />
            </div>
            <input
              name="mapLinkLabel"
              defaultValue={data.contact.mapLinkLabel}
              placeholder="Map button label"
              className={inputClassName}
            />
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-bold">Working Hours</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <input name="weekdaysHours" defaultValue={data.contact.workingHours.weekdays} placeholder="Weekdays" className={inputClassName} />
              <input name="saturdayHours" defaultValue={data.contact.workingHours.saturday} placeholder="Saturday" className={inputClassName} />
              <input name="sundayHours" defaultValue={data.contact.workingHours.sunday} placeholder="Sunday" className={inputClassName} />
            </div>
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-bold">Top Footer Strip</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <input name="phoneTitle" defaultValue={data.contact.topBar.phoneTitle} placeholder="Phone title" className={inputClassName} />
              <input name="emailTitle" defaultValue={data.contact.topBar.emailTitle} placeholder="Email title" className={inputClassName} />
              <input name="locationTitle" defaultValue={data.contact.topBar.locationTitle} placeholder="Location title" className={inputClassName} />
            </div>
            <textarea name="phoneText" rows={2} defaultValue={data.contact.topBar.phoneText} placeholder="Phone helper text" className={inputClassName} />
            <textarea name="emailText" rows={2} defaultValue={data.contact.topBar.emailText} placeholder="Email helper text" className={inputClassName} />
            <textarea name="locationText" rows={2} defaultValue={data.contact.topBar.locationText} placeholder="Location helper text" className={inputClassName} />
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-bold">Footer Content</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="brandName" defaultValue={data.contact.footer.brandName} placeholder="Brand name" className={inputClassName} />
              <input name="connectTitle" defaultValue={data.contact.footer.connectTitle} placeholder="Social section title" className={inputClassName} />
              <input name="quickLinksTitle" defaultValue={data.contact.footer.quickLinksTitle} placeholder="Quick links title" className={inputClassName} />
              <input name="treatmentsTitle" defaultValue={data.contact.footer.treatmentsTitle} placeholder="Treatments title" className={inputClassName} />
              <input name="mapSectionTitle" defaultValue={data.contact.footer.mapSectionTitle} placeholder="Map section title" className={inputClassName} />
              <input name="facebookUrl" defaultValue={data.contact.footer.facebookUrl} placeholder="Facebook URL" className={inputClassName} />
              <input name="instagramUrl" defaultValue={data.contact.footer.instagramUrl} placeholder="Instagram URL" className={inputClassName} />
              <input name="whatsappUrl" defaultValue={data.contact.footer.whatsappUrl} placeholder="WhatsApp URL" className={inputClassName} />
            </div>
            <textarea
              name="treatments"
              rows={5}
              defaultValue={data.contact.footer.treatments.join("\n")}
              placeholder="One treatment per line"
              className={inputClassName}
            />
            <textarea
              name="copyright"
              rows={3}
              defaultValue={data.contact.footer.copyright}
              placeholder="Copyright text"
              className={inputClassName}
            />
            <p className="text-xs text-[var(--muted)]">
              Use one treatment per line. You can keep <span className="font-semibold">{"{year}"}</span> inside the copyright text and it will be replaced automatically.
            </p>
          </section>

          <button className="button button-primary w-fit">Save Contact Settings</button>
        </form>
      </article>
    </div>
  );
}
