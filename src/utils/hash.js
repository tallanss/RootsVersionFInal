// Hachage SHA-256 (hex).
// Sert de barrière DOUCE côté client pour les galeries protégées : on ne
// stocke jamais le mot de passe en clair, seulement son empreinte, et on
// compare l'empreinte à la saisie. ⚠️ Ce n'est PAS une sécurité forte —
// le contenu de la page reste côté client. C'est un garde-fou contre le
// survol occasionnel (un invité qui ouvrirait l'album d'un autre client).
export async function sha256hex(str) {
  const data = new TextEncoder().encode(String(str));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
