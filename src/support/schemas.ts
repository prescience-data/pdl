import { z } from "zod"

/**
 * Zod schema for narrowing output of People objects.
 *
 * @remarks
 * The full PDL payload is much larger than what we need for quick inspection.
 *
 * @public
 */
export const PersonSchema = z.object({
  id: z.string().nullish(),
  fullName: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  gender: z.string().nullish(),
  birthDate: z.string().nullish(),
  linkedinUrl: z.string().nullish(),
  linkedinUsername: z.string().nullish(),
  linkedinId: z.string().nullish(),
  facebookUrl: z.string().nullish(),
  facebookUsername: z.string().nullish(),
  facebookId: z.string().nullish(),
  twitterUrl: z.string().nullish(),
  twitterUsername: z.string().nullish(),
  githubUrl: z.string().nullish(),
  githubUsername: z.string().nullish(),
  workEmail: z.string().nullish(),
  personalEmails: z.array(z.string()).nullish(),
  recommendedPersonalEmail: z.string().nullish(),
  mobilePhone: z.string().nullish(),
  industry: z.string().nullish(),
  jobTitle: z.string().nullish(),
  jobCompanyName: z.string().nullish(),
  jobCompanyWebsite: z.string().nullish(),
  jobLastUpdated: z.string().nullish(),
  jobStartDate: z.string().nullish(),
  locationName: z.string().nullish(),
  locationRegion: z.string().nullish(),
  locationCountry: z.string().nullish(),
  locationContinent: z.string().nullish(),
  locationStreetAddress: z.string().nullish(),
  locationPostalCode: z.string().nullish(),
  locationGeo: z.string().nullish(),
  locationLastUpdated: z.string().nullish(),
  phoneNumbers: z.array(z.string()).nullish(),
  emails: z
    .array(
      z.object({
        address: z.string(),
        type: z.string().nullish()
      })
    )
    .nullish(),
  interests: z.array(z.string()).nullish(),
  skills: z.array(z.string()).nullish(),
  locationNames: z.array(z.string()).nullish(),
  countries: z.array(z.string()).nullish(),
  profiles: z
    .array(
      z.object({
        network: z.string().nullish(),
        id: z.string().nullish(),
        url: z.string().nullish(),
        username: z.string().nullish()
      })
    )
    .nullish()
})

/**
 * Inferred type for PersonSchema.
 *
 * @public
 */
export type Person = z.infer<typeof PersonSchema>
