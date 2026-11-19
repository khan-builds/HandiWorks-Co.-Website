/** The four people behind HelpingHand. The Team page and the footer's Contact list both read this.
    The homepage (index.html) carries a hand-built copy of the footer: change both together.

    Names and roles as on the team poster; emails as Lingbo gave them on 2026-11-18. `bio` and
    `photo` (a path under public/) are filled in as each person sends theirs; until then the
    Team page shows initials and says so. */
export type Member = { name: string; role: string; email: string; bio?: string; photo?: string };

export const team: Member[] = [
  { name: 'Billy Jin', role: 'Programming Lead', email: 'billyjin@gmail.com' },
  { name: 'Golam Khan', role: 'Design Lead', email: 'gkhan@gmail.com' },
  { name: 'Clarence Li', role: 'Circuitry Lead', email: 'clarenceli@gmail.com' },
  { name: 'Lingbo Zhang', role: 'Project Manager', email: 'lingbo.zhang@gmail.com' },
];

/** Where "Request a kit" goes: the project manager. One address, not all four, because some
    mail programs do not split a list of addresses in a mailto link. */
export const CONTACT_EMAIL = team.find((m) => m.role === 'Project Manager')!.email;
