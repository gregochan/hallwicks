"use client";

const ESTABLISHED_YEAR = 1987;

export function ExperienceYears() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  return <strong>{years} yrs</strong>;
}
