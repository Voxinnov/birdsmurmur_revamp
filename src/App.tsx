import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Bird, CalendarDays, Check, ChevronLeft, ChevronRight, Compass, Instagram, MapPin, Menu, Play, Plus, Sparkles, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const photos = {
  hero: '/media/camp-01.jpg',
  camp: '/media/camp-01.jpg',
  riverside: '/media/camp-04.jpg',
  tent: '/media/camp-05.jpg',
  forest: '/media/camp-03.jpg',
  wildlife: '/media/wildlife-elephant.jpg',
  river: '/media/camp-02.jpg',
  trail: '/media/camp-03.jpg',
  raft: '/media/camp-06.jpg',
  tent2: '/media/camp-07.jpg',
  water: '/media/camp-04.jpg',
}
const experiences = [
  { no: '01', title: 'Birding with a naturalist', kind: 'BIRDING & NATURE WALKS', body: 'A one-hour birding session around camp is included for in-house guests. Naturalists can also guide visits to Thattekad Bird Sanctuary.', image: photos.wildlife },
  { no: '02', title: 'Kayak the Edamalayar', kind: 'KAYAKING & BAMBOO RAFTING', body: 'Take to the river with an instructor. A 45-minute kayak session is included when water levels allow; longer trips are optional.', image: photos.river },
  { no: '03', title: 'Walk the plantations', kind: 'PLANTATION EXPERIENCE', body: 'Join a resident naturalist to discover local crops, village life, and the landscape around camp on a guided plantation walk.', image: photos.trail },
  { no: '04', title: 'Ride the village roads', kind: 'COUNTRYSIDE CYCLING', body: 'Use the camp bicycles to explore quiet rural roads. Longer rides can reach Bhoothathankettu Dam and the hanging bridge.', image: photos.raft },
]

const gallery = [
  { image: photos.camp, label: 'The camp by the river', tag: 'THE CAMP', tall: true },
  { image: photos.riverside, label: 'A walk in the forest', tag: 'LANDSCAPES' },
  { image: photos.wildlife, label: 'Wildlife across the river', tag: 'WILDLIFE' },
  { image: photos.tent, label: 'Inside a glamping tent', tag: 'THE ROOMS' },
  { image: photos.raft, label: 'On the Edamalayar', tag: 'EXPERIENCES' },
]

const testimonials = [
  { quote: 'Our colleagues and their family had a memorable time here.', name: 'Nikhil' },
  { quote: 'Highly recommended.', name: 'Prakash' },
  { quote: 'Perfect place to be with nature.', name: 'Anu' },
  { quote: 'Paradise for nature lovers.', name: 'Sanu' },
]

const heroSlides = [
  { image: photos.hero, label: 'THE RIVERSIDE CAMP', alt: 'Birds Murmur Camp grounds and riverside setting in Thattekad' },
  { image: photos.river, label: 'KAYAK THE EDAMALAYAR', alt: 'Guests kayaking on the Edamalayar with Birds Murmur Camp' },
  { image: photos.forest, label: 'A WALK IN THE FOREST', alt: 'A forest walk near Birds Murmur Camp' },
  { image: photos.wildlife, label: 'WILDLIFE NEAR THE CAMP', alt: 'An elephant photographed in the forest across the river from camp' },
]

function Image({ src, alt, className = '', loading = 'lazy' }: { src: string; alt: string; className?: string; loading?: 'eager' | 'lazy' }) {
  return <img className={className} src={src} alt={alt} loading={loading} />
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [activeStory, setActiveStory] = useState(0)
  const [activeHero, setActiveHero] = useState(0)
  const [sound, setSound] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    // ScrollTrigger updates through Lenis' scroll event; GSAP owns element animation.
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 32, opacity: 0, duration: 1.1, stagger: 0.13, ease: 'power3.out', delay: 0.25 })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(8% 8% 8% 8%)', scale: 1.06 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } })
      })
      gsap.to('.journey-image', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
    }, root)
    return () => { cancelAnimationFrame(frame); ctx.revert(); lenis.destroy(); void ticker }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveImage(null); setFormOpen(false); setMenuOpen(false) }
      if (activeImage !== null && e.key === 'ArrowRight') setActiveImage((activeImage + 1) % gallery.length)
      if (activeImage !== null && e.key === 'ArrowLeft') setActiveImage((activeImage + gallery.length - 1) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeImage])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const interval = window.setInterval(() => setActiveHero((current) => (current + 1) % heroSlides.length), 6500)
    return () => window.clearInterval(interval)
  }, [])

  const openEnquiry = () => { setSent(false); setFormOpen(true) }
  const closeMenu = () => setMenuOpen(false)

  return <div className="site" ref={root}>
    <header className={`nav ${menuOpen ? 'nav--open' : ''}`}>
      <a href="#home" className="brand" onClick={closeMenu} aria-label="Birds Murmur Camp home"><Image src="/media/brand-logo.png" alt="Birds Murmur Camp" className="brand-logo" loading="eager" /></a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#story" onClick={closeMenu}>The camp</a><a href="#stay" onClick={closeMenu}>Stay</a><a href="#experiences" onClick={closeMenu}>Experiences</a><a href="#gallery" onClick={closeMenu}>Journal</a>
      </nav>
      <a href="#reserve" className="nav-cta">Plan your stay <ArrowUpRight size={15} /></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-media" aria-live="off">{heroSlides.map((slide, i) => <Image key={slide.image} src={slide.image} alt={i === activeHero ? slide.alt : ''} className={`hero-image hero-slide ${i === activeHero ? 'hero-slide--active' : ''}`} loading={i === 0 ? 'eager' : 'lazy'} />)}</div>
        <div className="hero-shade" />
        <div className="hero-topline"><span>THATTEKAD · KERALA, INDIA</span><span className="live-dot">{heroSlides[activeHero].label}</span></div>
        <div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="eyebrow-rule" /> ON THE BANKS OF THE EDAMALAYAR</span><h1>Where the<br /><em>forest</em> whispers<span className="title-period">.</span></h1><p className="hero-sub">And nature tells its stories.</p><p className="hero-desc">Eight air-conditioned glamping tents by the river, a short journey from Salim Ali’s Thattekad Bird Sanctuary.</p><div className="hero-actions"><a className="button button--light" href="#story">Discover the camp <ArrowDownRight size={16} /></a><a className="text-link hero-book" href="tel:+919961813519">Call reservations <ArrowUpRight size={15} /></a></div></div>
        <div className="hero-bottom"><span>10°08′N&nbsp;&nbsp; 76°42′E</span><a href="#story" className="scroll-hint"><span>SCROLL TO WANDER</span><ArrowDown size={15} /></a><div className="hero-carousel-controls" aria-label="Hero image controls"><button className="hero-carousel-toggle" onClick={() => setActiveHero((activeHero + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous hero image"><ChevronLeft size={14} /></button>{heroSlides.map((slide, i) => <button key={slide.label} onClick={() => setActiveHero(i)} aria-label={`Show ${slide.label.toLowerCase()}`} aria-current={i === activeHero ? 'true' : undefined} className={`hero-dot ${i === activeHero ? 'hero-dot--active' : ''}`} />)}<button className="hero-carousel-toggle" onClick={() => setActiveHero((activeHero + 1) % heroSlides.length)} aria-label="Next hero image"><ChevronRight size={14} /></button><span className="hero-index">0{activeHero + 1} <i>/</i> 0{heroSlides.length}</span></div></div>
      </section>

      <section className="intro section-pad" id="story">
        <div className="intro-images" data-reveal><div className="intro-main" data-image-reveal><Image src={photos.camp} alt="Birds Murmur Camp grounds among plantations beside the Edamalayar" /></div><div className="intro-detail" data-image-reveal><Image src={photos.riverside} alt="A forest walk near Birds Murmur Camp" /><span className="image-note">PHOTOGRAPH FROM THE CAMP GALLERY</span></div><div className="intro-stamp"><span>ON THE<br />EDAMALAYAR</span><Compass size={23} strokeWidth={1} /></div></div>
        <div className="intro-copy" data-reveal><span className="eyebrow"><span className="eyebrow-rule" /> ABOUT BIRDS MURMUR CAMP</span><h2>An escape into<br />nature’s <em>embrace.</em></h2><p className="body-copy">On the banks of the Edamalayar, Birds Murmur Camp brings you close to the river, verdant jungle, and wildlife of Thattekad. Eight well-appointed glamping tents with private en-suite facilities offer a comfortable base for exploring Salim Ali Bird Sanctuary with the help of resident naturalists.</p><p className="body-copy body-copy--soft">Each tent looks out to the forest, and wildlife is often spotted from the veranda. The sanctuary entrance and other local sights are a short journey away.</p><a className="under-link" href="#stay">Explore the rooms <ArrowUpRight size={15} /></a><div className="intro-facts"><div><strong>08</strong><span>GLAMPING TENTS</span></div><div><strong>AC</strong><span>AIR-CONDITIONED</span></div><div><strong>0</strong><span>SINGLE-USE PLASTIC</span></div></div></div>
      </section>

      <section className="journey">
        <div className="journey-scene"><Image src={photos.forest} alt="Deep layers of tropical forest, a demonstration image" className="journey-image" /><div className="journey-grain" /><div className="journey-content" data-reveal><span className="eyebrow eyebrow--light"><span className="eyebrow-rule" /> THE FOREST, AT ITS OWN PACE</span><h2>Beyond the ordinary.<br /><em>Closer to the wild.</em></h2><p>Here, the day is measured in birdsong and changing light.<br />Here, you can hear yourself think again.</p><a className="round-link" href="#experiences" aria-label="Explore experiences"><ArrowDown size={18} /></a></div><span className="journey-caption">A WINDOW INTO THE WESTERN GHATS</span><div className="journey-leaf leaf-one">✳</div><div className="journey-leaf leaf-two">✳</div></div>
      </section>

      <section className="stay section-pad" id="stay">
        <div className="section-heading" data-reveal><div><span className="eyebrow"><span className="eyebrow-rule" /> A SOFTER KIND OF STAY</span><h2>Sleep beneath<br />the <em>canopy.</em></h2></div><div className="heading-aside"><span className="serif-small">Comfort meets<br />the untamed.</span><p>Eight thoughtfully appointed glamping tents, each with private en-suite facilities. Close to the forest, with the comforts that make you feel at home.</p><button className="under-link under-button" onClick={openEnquiry}>Find your tent <ArrowUpRight size={15} /></button></div></div>
        <div className="stay-showcase" data-reveal><div className="stay-photo" data-image-reveal><Image src={photos.tent} alt="A Birds Murmur Camp glamping tent interior with twin beds, private bathroom and air conditioning" /><div className="stay-tag"><span className="tag-number">01—08</span><span>THE GLAMPING TENTS</span></div><span className="media-label">BIRDS MURMUR CAMP PHOTO</span></div><div className="stay-side"><div className="stay-side-image" data-image-reveal><Image src={photos.tent2} alt="Interior of a Birds Murmur Camp glamping tent" /><span className="media-label">BIRDS MURMUR CAMP PHOTO</span></div><div className="stay-detail"><span className="eyebrow">ROOM TO SETTLE IN</span><p>Eight intimate tents with comfortable twin beds, quality linen, air-conditioning, and private en-suite facilities.</p><div className="amenities"><span><Check size={13} /> Private en-suite</span><span><Check size={13} /> Air-conditioned</span><span><Check size={13} /> Forest views</span></div><div className="tariff-strip"><span>FROM <strong>₹7,500</strong> / NIGHT</span><span>SINGLE OCCUPANCY · TARIFF THROUGH 30 JUN 2027</span><span>DOUBLE / TWIN ₹8,500 · EXTRA PERSON ₹1,925</span></div><p className="stay-inclusions">Rates include bed &amp; breakfast, a 45-minute kayaking session when river levels allow, one-hour plantation and birding session with a naturalist, local-use bicycles, and camp games.</p><p className="eco-note">A zero-plastic zone. Drinking water is served in sterilised glass bottles.</p></div></div><button className="gallery-open" onClick={() => setActiveImage(3)} aria-label="View accommodation photograph"><Plus size={18} /></button></div>
      </section>

      <section className="experiences section-pad" id="experiences"><div className="section-heading experience-heading" data-reveal><div><span className="eyebrow"><span className="eyebrow-rule" /> ACTIVITIES AT THE CAMP</span><h2>Every moment,<br /><em>an adventure.</em></h2></div><p className="heading-aside experience-intro">Go out with the camp’s resident naturalists, paddle the river, or take a bicycle along the quiet village roads.</p></div><div className="experience-grid">{experiences.map((item) => <article className="experience-card" key={item.no} data-reveal><a href="#reserve" onClick={(e) => { e.preventDefault(); openEnquiry() }} className="experience-photo"><Image src={item.image} alt={`${item.kind.toLowerCase()} at Birds Murmur Camp`} /><span className="experience-number">{item.no}</span><span className="experience-arrow"><ArrowUpRight size={17} /></span><span className="experience-media-label">CAMP PHOTO</span></a><div className="experience-info"><span className="eyebrow">{item.kind}</span><h3>{item.title}</h3><p>{item.body}</p><button className="mini-link" onClick={openEnquiry}>Ask about this activity <ArrowRight size={13} /></button></div></article>)}</div><div className="activities-note"><strong>ALSO AT THE CAMP</strong><span>Badminton · Carrom · Soft archery · Darts · Chess · Football</span><span>Optional extras include a sanctuary visit with a naturalist, boat safari, longer kayaking, campfire and barbecue.</span></div></section>

      <section className="wildlife"><div className="wildlife-image"><Image src={photos.wildlife} alt="An elephant photographed in the forest across the river from the camp" /><div className="wildlife-shade" /></div><div className="wildlife-content" data-reveal><span className="eyebrow eyebrow--light"><span className="eyebrow-rule" /> THE WILDLIFE EXPERIENCE</span><h2>Listen to the<br />language of<br /><em>the wild.</em></h2><p>Birdlife brings many guests to Thattekad. Resident naturalists know the seasonal birding spots, while forest and river views around camp bring their own wildlife moments. Sightings are part of the wild, never guaranteed.</p><a className="button button--light" href="#experiences">Explore birding & nature walks <ArrowUpRight size={15} /></a></div><div className="wildlife-index"><Bird size={15} /><span>SALIM ALI BIRD SANCTUARY · THATTEKAD</span><span>WILDLIFE PHOTO · CAMP GALLERY</span></div><button className={`sound-toggle ${sound ? 'sound-toggle--on' : ''}`} onClick={() => setSound(!sound)} aria-pressed={sound}><span className="sound-wave">{sound ? ')))' : '···'}</span> AMBIENCE {sound ? 'ON' : 'OFF'} <span className="sound-note">(OPTIONAL)</span></button></section>

      <section className="gallery section-pad" id="gallery"><div className="gallery-head" data-reveal><div><span className="eyebrow"><span className="eyebrow-rule" /> FROM THE CAMP GALLERY</span><h2>Moments worth<br /><em>remembering.</em></h2></div><div className="gallery-head-right"><p>The rooms, river, forest, and activities at Birds Murmur Camp.</p><span className="gallery-counter">OFFICIAL PROPERTY PHOTOGRAPHS &nbsp;·&nbsp; 05 FRAMES</span></div></div><div className="gallery-grid">{gallery.map((item, i) => <button className={`gallery-tile ${item.tall ? 'gallery-tile--tall' : ''} ${i === 4 ? 'gallery-tile--wide' : ''}`} key={item.tag} onClick={() => setActiveImage(i)} data-image-reveal aria-label={`Open photograph: ${item.label}`}><Image src={item.image} alt={item.label} /><span className="tile-shade" /><span className="tile-label"><small>{item.tag}</small><strong>{item.label}</strong></span><span className="tile-open"><Plus size={17} /></span><span className="tile-num">0{i + 1}</span><span className="media-label">CAMP PHOTO</span></button>)}</div><p className="gallery-disclaimer">Photos in this gallery are from the official Birds Murmur Camp website. The moving background footage above is representative rainforest footage.</p></section>

      <section className="quote-section"><div className="quote-bg"><Image src={photos.river} alt="Guests kayaking on the river at Birds Murmur Camp" /></div><div className="quote-overlay" /><div className="quote-content" data-reveal><span className="eyebrow eyebrow--light"><span className="eyebrow-rule" /> STORIES FROM OUR GUESTS</span><div className="quote-mark">“</div><h2>{testimonials[activeStory].quote}</h2><div className="quote-controls"><span>{testimonials[activeStory].name.toUpperCase()} &nbsp;·&nbsp; CAMP TESTIMONIAL</span><div><button onClick={() => setActiveStory((activeStory + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonial"><ChevronLeft size={18} /></button><button onClick={() => setActiveStory((activeStory + 1) % testimonials.length)} aria-label="Next testimonial"><ChevronRight size={18} /></button></div></div><a className="review-link" href="https://birdsmurmurcamp.com/testi.php" target="_blank" rel="noreferrer">READ MORE GUEST STORIES <ArrowUpRight size={13} /></a></div><span className="quote-disclaimer">GUEST COMMENTS PUBLISHED ON THE OFFICIAL CAMP WEBSITE</span></section>

      <section className="reserve section-pad" id="reserve"><div className="reserve-photo"><Image src={photos.water} alt="A camp photograph of the forest landscape near the Edamalayar" /><div className="reserve-gradient" /><div className="reserve-inner" data-reveal><span className="eyebrow eyebrow--light"><span className="eyebrow-rule" /> WHEN YOU’RE READY</span><h2>Your journey into<br />the wild <em>begins here.</em></h2><p>Ask about dates, room availability, and activities.<br />Our reservations team can help you plan your visit.</p><button className="button button--light" onClick={openEnquiry}>Enquire about a stay <ArrowUpRight size={16} /></button><a className="reserve-phone" href="tel:+919961813519">Reservations · +91 99618 13519</a><span className="reserve-note">ENQUIRIES ONLY · PLEASE CONFIRM AVAILABILITY WITH THE CAMP</span></div><span className="reserve-coord">THATTEKAD, KERALA · NJAYAPPILLI</span></div></section>
    </main>

    <footer className="footer"><div className="footer-top"><a className="brand brand--footer" href="#home"><Image src="/media/brand-logo.png" alt="Birds Murmur Camp" className="brand-logo" loading="lazy" /></a><span className="footer-tagline">Let the forest<br /><em>find you.</em></span><a className="footer-back" href="#home">BACK TO THE CANOPY <ArrowUpRight size={14} /></a></div><div className="footer-main"><div className="footer-address"><MapPin size={16} strokeWidth={1.3} /><p>Njayappilli, Thattekad<br />Kerala 686681, India<br /><a href="https://maps.google.com/?q=10.14485947330817,76.69933721421037" target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={12} /></a></p></div><div className="footer-contact"><span className="footer-label">CONTACT & RESERVATIONS</span><p>Camp: <a href="tel:+919946139050">+91 99461 39050</a><br /><a href="tel:+919497425129">+91 94974 25129</a><br />Reservations: <a href="tel:+919961813519">+91 99618 13519</a><br /><a href="mailto:info@birdsmurmurcamp.com">info@birdsmurmurcamp.com</a></p></div><div className="footer-explore"><span className="footer-label">EXPLORE</span><a href="#story">About the camp</a><a href="#stay">Accommodation & tariff</a><a href="#experiences">Activities</a><a href="https://birdsmurmurcamp.com/tours.php" target="_blank" rel="noreferrer">Tours & holidays</a><a href="https://birdsmurmurcamp.com/testi.php" target="_blank" rel="noreferrer">Testimonials</a><a href="#gallery">Photo gallery</a></div><div className="footer-follow"><span className="footer-label">FOLLOW THE CAMP</span><a href="https://www.instagram.com/birdsmurmurcamp_tkd/" target="_blank" rel="noreferrer">Instagram <Instagram size={14} /></a><a href="https://m.facebook.com/pages/category/Hotel-Resort/Birds-Murmur-Camp-Thattekkad-120239506400314/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a><a href="https://www.tripadvisor.in/Hotel_Review-g7793812-d21498786-Reviews-Birds_Murmur_Camp-Thattekad_Ernakulam_District_Kerala.html" target="_blank" rel="noreferrer">Tripadvisor <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BIRDS MURMUR CAMP</span><span>BASED ON PROPERTY DETAILS PUBLISHED BY THE CAMP</span><span>BACKGROUND FOOTAGE IS REPRESENTATIVE</span></div></footer>

    {activeImage !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" onClick={() => setActiveImage(null)}><button className="lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close image"><X /></button><button className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + gallery.length - 1) % gallery.length) }} aria-label="Previous image"><ChevronLeft /></button><figure onClick={(e) => e.stopPropagation()}><Image src={gallery[activeImage].image} alt={gallery[activeImage].label} loading="eager" /><figcaption><span>{gallery[activeImage].tag}</span>{gallery[activeImage].label}<small>Photo from Birds Murmur Camp’s official website</small></figcaption></figure><button className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + 1) % gallery.length) }} aria-label="Next image"><ChevronRight /></button></div>}

    {formOpen && <div className="modal-scrim" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false) }}><div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="modal-close" onClick={() => setFormOpen(false)} aria-label="Close enquiry"><X size={19} /></button>{sent ? <div className="form-success"><span className="success-icon"><Check /></span><span className="eyebrow">THANK YOU FOR REACHING OUT</span><h2>We’ll be in touch.</h2><p>Your email app has opened with your enquiry ready to send.</p><button className="under-link under-button" onClick={() => setFormOpen(false)}>Back to the forest <ArrowRight size={14} /></button></div> : <><span className="eyebrow"><span className="eyebrow-rule" /> A NOTE TO THE CAMP</span><h2 id="enquiry-title">Plan a slower<br /><em>kind of stay.</em></h2><p className="modal-intro">Tell us a little about your visit. Your enquiry will open in your email app, ready for you to send.</p><form onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); const name = String(data.get('name') || ''); const email = String(data.get('email') || ''); const dates = String(data.get('dates') || 'Flexible'); const guests = String(data.get('guests') || '2'); const note = String(data.get('note') || ''); const body = `Hello Birds Murmur Camp,\n\nI'd like to enquire about a stay.\n\nName: ${name}\nEmail: ${email}\nPreferred dates: ${dates}\nGuests: ${guests}\n\n${note}`; window.location.href = `mailto:info@birdsmurmurcamp.com?subject=${encodeURIComponent('Stay enquiry — Birds Murmur Camp')}&body=${encodeURIComponent(body)}`; setSent(true) }}><label>Your name<input required name="name" placeholder="How should we address you?" /></label><div className="form-row"><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>Number of guests<select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5+">5+ guests</option></select></label></div><label>Preferred dates<input name="dates" placeholder="Flexible or your dates" /></label><label>A note for us <span className="optional">OPTIONAL</span><textarea name="note" rows={2} placeholder="Anything you'd like us to know?" /></label><button type="submit" className="button button--dark">Prepare enquiry <ArrowUpRight size={15} /></button></form><p className="enquiry-note"><CalendarDays size={13} /> This is an enquiry only; your stay is not confirmed here.</p></>}</div></div>}
  </div>
}

export default App
