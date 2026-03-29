import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Legal = () => {
  return (
    <div className="animate-in">
      <Helmet>
        <title>Mentions Légales & CGV | PhotoRoots</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="container" style={{ padding: '32px 20px 80px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600, marginBottom: '24px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <div className="section-tag"><Shield size={14} /> Informations légales</div>
        <h1 className="section-title" style={{ fontSize: '28px', marginBottom: '32px' }}>Mentions Légales & CGV</h1>

        {/* Mentions Légales */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" /> Mentions Légales
          </h2>

          <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '16px', marginBottom: '8px' }}>1. Éditeur du site</h3>
            <p><strong>PhotoRoots</strong><br />
            Micro-entreprise — SIRET : [À compléter]<br />
            Siège social : Le Havre, Seine-Maritime (76)<br />
            Email : contact@photoroots.fr<br />
            Téléphone : +33 6 12 34 56 78</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>2. Hébergement</h3>
            <p>Ce site est hébergé par [À compléter — ex: OVH, Vercel, Netlify].</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>3. Propriété intellectuelle</h3>
            <p>L'ensemble des contenus (textes, images, photos, vidéos, logos) présents sur ce site sont protégés par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>4. Données personnelles (RGPD)</h3>
            <p>Les informations collectées via le formulaire de réservation sont destinées exclusivement à PhotoRoots pour le traitement de votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à : contact@photoroots.fr</p>
            <p style={{ marginTop: '8px' }}>Aucune donnée n'est transmise à des tiers. Les données sont conservées pendant une durée maximale de 36 mois après votre dernière interaction.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>5. Cookies</h3>
            <p>Ce site utilise des cookies strictement nécessaires au fonctionnement (mémorisation des préférences). Aucun cookie publicitaire ou de tracking n'est utilisé sans votre consentement explicite.</p>
          </div>
        </div>

        {/* CGV */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--primary)" /> Conditions Générales de Vente
          </h2>

          <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '16px', marginBottom: '8px' }}>Article 1 — Objet</h3>
            <p>Les présentes conditions régissent les prestations de location de photobooth proposées par PhotoRoots pour tout type d'événement (mariage, anniversaire, événement d'entreprise, etc.).</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 2 — Réservation</h3>
            <p>Toute réservation effectuée via le site internet est confirmée par email. Un acompte de 30% du montant total est demandé pour valider la réservation. Le solde est dû le jour de l'événement.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 3 — Annulation</h3>
            <p><strong>Par le client :</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
              <li>Plus de 30 jours avant : remboursement intégral de l'acompte</li>
              <li>Entre 15 et 30 jours : remboursement de 50% de l'acompte</li>
              <li>Moins de 15 jours : l'acompte est conservé</li>
            </ul>
            <p style={{ marginTop: '8px' }}><strong>Par PhotoRoots :</strong> En cas de force majeure, PhotoRoots s'engage à proposer une date de report ou un remboursement intégral.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 4 — Prestations</h3>
            <p>Les formules proposées incluent la mise à disposition du matériel, l'installation et la désinstallation, ainsi que l'accompagnement pendant l'événement selon la formule choisie.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 5 — Responsabilité</h3>
            <p>Le client s'engage à utiliser le matériel mis à disposition de manière raisonnable. Tout dommage causé au matériel durant l'événement sera facturé au client selon le coût de réparation ou de remplacement.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 6 — Droit à l'image</h3>
            <p>Sauf mention contraire expresse, PhotoRoots se réserve le droit d'utiliser les photos prises lors de l'événement à des fins de communication et de portfolio. Les photos ne seront jamais utilisées à des fins commerciales tierces.</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>Article 7 — Litiges</h3>
            <p>En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents du ressort du Havre seront seuls compétents.</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '24px' }}>
          Dernière mise à jour : Mars 2026
        </p>
      </section>
    </div>
  );
};

export default Legal;
