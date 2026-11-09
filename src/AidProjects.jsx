import React, {useEffect, useState} from 'react';
import { Droplets, HeartHandshake, ArrowUpRight } from 'lucide-react';
import {fetchWelfare, imageUrl, localized, welfareEndpoint} from './welfare-cms.js';
import './welfare.css';
import {WelfareSlider} from './WelfareSlider.jsx';

const copy = {
 de:{label:'HILFSPROJEKTE',title:'Verantwortung kennt',accent:'keine Grenzen.',intro:'Unser Engagement reicht über Unternehmen hinaus: Wir unterstützen den Brunnenbau in Afrika und helfen Kindern.',projects:[['Brunnen in Afrika','Wasser schafft Perspektiven.','Unser Engagement für den Bau von Brunnen in Afrika.'],['Kindern helfen','Chancen für die nächste Generation.','Kinder unterstützen und ihnen neue Perspektiven ermöglichen.']],photos:'Einblicke und Fotos unserer Hilfsprojekte folgen.',cta:'Über Hilfsprojekte sprechen'},
 en:{label:'AID PROJECTS',title:'Responsibility knows',accent:'no borders.',intro:'Our commitment extends beyond business: we support the construction of wells in Africa and help children.',projects:[['Wells in Africa','Water opens up possibilities.','Our commitment to building wells in Africa.'],['Helping children','Opportunities for the next generation.','Supporting children and opening up new possibilities for their future.']],photos:'Stories and photos from our aid projects will follow.',cta:'Talk about aid projects'},
 fr:{label:'PROJETS SOLIDAIRES',title:'La responsabilité ne connaît',accent:'pas de frontières.',intro:'Notre engagement va au-delà des entreprises : nous soutenons la construction de puits en Afrique et aidons les enfants.',projects:[['Des puits en Afrique','L’eau ouvre des perspectives.','Notre engagement pour la construction de puits en Afrique.'],['Aider les enfants','Des chances pour la prochaine génération.','Soutenir les enfants et leur ouvrir de nouvelles perspectives.']],photos:'Les récits et les photos de nos projets solidaires seront bientôt disponibles.',cta:'Parler des projets solidaires'},
 es:{label:'PROYECTOS SOLIDARIOS',title:'La responsabilidad',accent:'no conoce fronteras.',intro:'Nuestro compromiso va más allá de las empresas: apoyamos la construcción de pozos en África y ayudamos a los niños.',projects:[['Pozos en África','El agua abre posibilidades.','Nuestro compromiso con la construcción de pozos en África.'],['Ayudar a los niños','Oportunidades para la próxima generación.','Apoyar a los niños y abrir nuevas perspectivas para su futuro.']],photos:'Próximamente compartiremos historias y fotografías de nuestros proyectos solidarios.',cta:'Hablar de proyectos solidarios'}
};

const labels = {
 de: {planned:'Geplant', ongoing:'Laufend', completed:'Abgeschlossen', gallery:'Fotogalerie', details:'Mehr erfahren', empty:'Neue Hilfsprojekte werden hier veröffentlicht.'},
 en: {planned:'Planned', ongoing:'Ongoing', completed:'Completed', gallery:'Photo gallery', details:'Read more', empty:'New aid projects will be shared here.'},
 fr: {planned:'Prévu', ongoing:'En cours', completed:'Terminé', gallery:'Galerie photos', details:'En savoir plus', empty:'De nouveaux projets solidaires seront publiés ici.'},
 es: {planned:'Previsto', ongoing:'En curso', completed:'Finalizado', gallery:'Galería de fotos', details:'Leer más', empty:'Aquí se publicarán nuevos proyectos solidarios.'},
};
const endpoint = welfareEndpoint(import.meta.env.VITE_SANITY_PROJECT_ID, import.meta.env.VITE_SANITY_DATASET || 'production');

function Photo({photo, lang, className, fallback}) {
 const [failed, setFailed] = useState(false);
 const src = imageUrl(photo?.url);
 useEffect(() => setFailed(false), [src]);
 if (!src || failed) return null;
 return <img className={className} src={src} alt={localized(photo.alt, lang) || fallback} loading="lazy" decoding="async" onError={() => setFailed(true)}/>;
}

export function AidProjects({lang}) {
 const t=copy[lang] || copy.en;
 const l=labels[lang] || labels.en;
 const [remote, setRemote] = useState(null);
 useEffect(() => {
  if (!endpoint) return;
  let controller;
  let lastAttempt = 0;
  let disposed = false;
  const refresh = async () => {
   if (document.hidden || Date.now() - lastAttempt < 60000) return;
   lastAttempt = Date.now();
   controller?.abort();
   controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 10000);
   try { const projects = await fetchWelfare(endpoint, controller.signal); if (!disposed) setRemote(projects); }
   catch (error) { if (error.name !== 'AbortError') console.warn('Welfare content unavailable; retaining existing content.'); }
   finally { clearTimeout(timeout); }
  };
  refresh();
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', refresh);
  return () => {disposed = true; controller?.abort(); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh);};
 }, []);
 const projects = remote ?? t.projects.map((p,i) => ({_id:`fallback-${i}`,title:p[0],summary:p[1],description:p[2],category:i===0?'water':'children'}));
 return <section id="aid-projects" className="section aid-projects"><div className="container">
  <p className="section-label">{t.label}</p><div className="section-heading"><h2>{t.title}<br/><em>{t.accent}</em></h2><p>{t.intro}</p></div>
  <WelfareSlider lang={lang}>{projects.map((project,index) => {
   const Icon = project.category === 'water' ? Droplets : HeartHandshake;
   const title = localized(project.title, lang);
   const gallery = Array.isArray(project.gallery) ? project.gallery.filter(p => p && imageUrl(p.url)) : [];
   const description = localized(project.description, lang);
   return <article className="aid-card" key={project._id}>
    <Photo photo={project.cover} lang={lang} className="aid-cover" fallback={title}/>
    <div className="aid-card-top"><Icon size={36} strokeWidth={1}/><span>{String(index+1).padStart(2,'0')}</span></div>
    <p className="section-label">{title}</p><h3>{localized(project.summary,lang) || title}</h3>
    {(project.location || l[project.status]) && <div className="aid-meta">{project.location && <span>{project.location}</span>}{l[project.status] && <span className="aid-status">{l[project.status]}</span>}</div>}
    {remote === null ? <p>{description}</p> : (description || gallery.length > 0) && <details className="aid-details"><summary>{l.details}</summary>
     {description && <p className="aid-description">{description}</p>}
     {gallery.length > 0 && <div className="aid-gallery" role="group" aria-label={`${l.gallery}: ${title}`}>{gallery.map((photo,i) => <Photo key={photo._key || i} photo={photo} lang={lang} fallback={title}/>)}</div>}
    </details>}
   </article>;
  })}</WelfareSlider>
  {remote?.length === 0 && <p className="aid-empty">{l.empty}</p>}
  <div className="aid-footer">{remote === null && <p>{t.photos}</p>}<button className="text-link" onClick={()=>{window.dispatchEvent(new CustomEvent('akeem-enquiry',{detail:3}));document.getElementById('contact')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}>{t.cta}<ArrowUpRight size={18}/></button></div>
 </div></section>;
}
