# Chuheng (Arnold) Tao — personal portfolio

A static, responsive, dependency-free website. Open `index.html` locally or serve the directory with `python -m http.server 8000` and visit `http://localhost:8000`. No build command is required. The layout supports GitHub Pages and other static hosts; no public deployment has been performed.

## Current pages
- `index.html`: portfolio home, selected work, about and journal sections.
- `projects/ece385.html`: ECE 385 case study, final-system architecture, hardware JPEG exploration, CNN, resource utilization and actual demo stills.
- `styles.css`: shared responsive design.
- `assets/ece385/videos/`: two embedded original-quality H.264/AAC demonstration clips, with still-frame WebP posters. Video markup is directly in `projects/ece385.html` (no JavaScript or server needed for playback). Clips were losslessly remuxed for browser-friendly streaming; audio and video tracks are preserved, unnecessary container metadata and extra tracks removed.

## Before public launch
- Review the first-person biography and confirm individual roles with the project partner. The case study treats the completed system as team work and identifies the JPEG prototype as the author's work based on his own account.
- Confirm permissions for project photographs, videos and diagrams, and any course policy on publishing student project material. The raw archive and full report (which include student identifiers, generated files and internal material) are intentionally not bundled. Do not publish the source archive without reviewing course rules and third-party licensing.
- Replace or expand the introductory copy, journal content, and project cards as new material is provided. Add a reviewed CV/contact link when available.
- Hardware JPEG reference was found in `.metadata/.plugins/org.eclipse.core.resources/.history/5a/707fbc34bb43001117f284b9a3603ed0` inside the original ZIP. Its header names `core_jpeg_decoder by ultraembedded`. Seven non-export-duplicate XSA files contain `jpeg_decoder_0`; clock metadata confirms 25 and 50 MHz variants. In particular `hardware_jpeg_reduced16/hw/bd_wrapper.xsa` contains `rgb565_to_rgb888_0`. The original modified RTL isn't included, so do not claim exact internal algorithm changes, verified speedup or a working final hardware-decoder demo without more evidence. The camera HDMI video demonstrates the live camera pipeline, but does not by itself identify whether decoding ran in firmware or custom hardware.
- Report's final architecture uses software TJpgDec, not hardware JPEG; do not conflate it with the prototype. Reported negative WNS is disclosed. Reported refresh and inference update rates are distinguished.

## Hosting
Upload the contents of this folder (not the containing ZIP) to a repository named `<username>.github.io` and enable GitHub Pages from the branch root, or use another static hosting provider. Review the public site on mobile and desktop before sharing with admissions committees.

## Version 3 — independent piezoelectric stick–slip actuator
- `projects/piezo-actuator.html`: February 2025 personal project, bench hardware, conceptual waveform/stick–slip diagrams, eight clips in recording order, and proposed quantitative measurements.
- `assets/piezo/videos/`: eight H.264/AAC web copies (720p) transcoded from the supplied HEVC videos, with original audio content where present and WebP poster frames. These are compressed copies, not original-quality masters. Original videos should be kept separately.
- No numerical speed, force, voltage, frequency, travel, or precision claims were made without measurements. The term “without a rotary motor” avoids suggesting the balls in a ball-bearing guide cannot rotate. The precise magnetic/contact geometry is not inferred from the videos; diagrams describe the general stick–slip principle. Review technical details and video privacy/permissions before publication.

## Version 5 — corrected prototype-based animation
- Replaces the incorrect generic drive-rail animation and static phase diagrams. The piezo and glued magnet move vertically alongside the ball-bearing slider, rather than pushing it with a separate rod.
- The sawtooth, illustrative static breakaway peak, lower kinetic friction and net slider motion are synchronized. Layout is based on video and the builder's explanation, not an exact dimensional drawing or measured force trace. Contact geometry and quantitative forces remain unverified.
- `assets/piezo/stick-slip.gif` loops; `stick-slip-still.webp` supplies the reduced-motion and pause image. Both original project pages and all ten videos remain present.

## Version 6 — mathematical curiosity project
- `projects/lad-regression.html`: rigorous retrospective of the June 2022 calculus report; preserves the original geometric insight while identifying established LAD regression, fixing two errors in the first listing, and supplying a proof of the finite-intersection method and a dataset-specific uniqueness certificate.
- `assets/lad/reproduce.py`: reproducibility script using NumPy, SciPy/HiGHS and Matplotlib. It reproduces the original five observations, coefficients, all ten candidates, LP check, OLS comparison, and dual certificate. `data.csv` and `candidates.csv` contain the results; `landscape.webp` and `fit.webp` are regenerated figures. The static site itself requires no Python or external dependencies.
- The 2026 derivation and checks are distinguished from original 2022 work. No claims of novelty, physical-model validity, out-of-sample accuracy or independent experimental verification are made. The original report is not publicly bundled.

## Version 7 — interactive geometric essay
- Restores authorship as an independent personal investigation, per the author's correction; removes earlier claims of teacher involvement and collaboration from public copy. Original 2022 graphics are recovered from the supplied document and the phone UI is cropped away from the hand-drawn pillar. The report itself is not bundled.
- `assets/lad/explorer.js` solves all ten intersections from the original five observations, clips polygonal sign regions exactly (up to floating-point precision), lifts the facets to their true absolute-error height, and links the interactive 2D parameter plane to a rotatable 3D surface. Play/pause, step, candidate selection, zoom, keyboard controls and lift are local, with no internet connection required. The vertical display scale is normalized for visualization.
- Math is pre-rendered from LaTeX using MathJax SVG with local glyph paths and retained TeX in `data-tex` attributes. No CDN, font downloads or external JavaScript are required. `assets/lad/MATHJAX-LICENSE.txt` contains the upstream license.
- The 2026 mathematical proof, uniqueness certificate, reproduced data and existing FPGA and piezo projects remain intact.

## Version 8 — a visual mathematical story
- Begins with a deliberately synthetic water-tank experiment (five volume readings), a physically meaningful rate/intercept model and the absolute-error objective. The illustrative dataset is not the original experiment.
- `assets/lad/hook.js` links the measurement plot to coefficient space, provides a three-step interactive reveal, compares ordinary least squares with absolute loss, shows a selected residual's V-shaped cross-section, and searches the ten intersections for the illustrative optimum.
- The actual 2022 fitting problem and observed data now appear before the original-data geometry lab, with fitted results deferred to verification. The lift starts flat and can be animated to reveal the exact facets; the original hand-drawn pillar remains part of the narrative.
- All 53 typeset expressions, archive images, original-data solver, proofs and previous project pages remain local. The standalone HTML embeds media and code; the portfolio ZIP contains the full site.

## Version 9 — admissions-facing summary
- Leads with the independent 2022 contribution, geometric insight, significance, and verified result before the illustrative water-tank story. The original sketch anchors the opening; visitors can jump to the original problem or proof.
- Identifies the original June 2022 calculus project by its actual title in the archive source note instead of referring vaguely to numbered report pages. The full original document remains unbundled.
- Preserves all interactive controls, offline MathJax-rendered equations, data, archive figures, and both engineering projects.

## Version 10 — correct minimum markers and elementary proof
- The explorer opens at the unique global optimum and full lift. A permanent green star identifies the r1/r5 crossing in both plots; the orange probe is distinct. All ten candidate markers are lifted to their actual loss values. Zoom uses a tight local window around the minimum.
- The main proof now uses elementary strips, bounded polygons and sliding level lines. Uniqueness follows from the distinct minimum corner value and planar interpolation. The independent linear-programming check remains separate.

## Version 11 — FPGA project separation and demo-first layout
- `projects/ece385.html` opens with both original video players, featuring the completed gesture-controlled game first (25 s), then camera bring-up (15 s). Both are linked in the hero and on the homepage; hardware stills remain in the case study.
- `projects/jpeg-decoder.html` is a separate, independently linked case study with the original prototype architecture, AXI DMA pseudocode, RGB565 memory layout, clock variants, upstream references and evidence limitations. The related FPGA videos are linked but not represented as verification of the hardware decoder.
- Homepage now has four distinct project pages; FPGA project and related prototype are 01A/01B. Other projects, math, interactions and all ten videos are preserved.

## Version 12 — Blu-ray laser scanning microscope
- New standalone `projects/laser-scanning-microscope.html` with a results-first introduction, two original demo videos, calibration target and scan extracted from montage V023, unchanged styrofoam PNG, and rotating onion-contour visualization V024. The author's 10 µm division spacing is explicitly distinguished from verified optical resolution or calibrated surface heights.
- Original photos document the optical head, stage, circuit bring-up and interface. Supplied reference schematics are attributed as references, with explicit links to Doctor Volt's original video and `michalin/Blu-ray-Laser-Scanning-Microscope` repository. No claim of authorship of upstream software or a measured wavelength/height is made.
- Includes 14 distinct microscope/related clips encoded as browser-compatible H.264/AAC, plus a link to eight already-present actuator clips instead of duplicating them. The additional actuator V008 is included. Video footage is retained in full duration at a web-friendly resolution. The interactive raster reveal uses the original styrofoam image, illustrating sequential sampling rather than reproducing actual scan timing.
- Five project pages; prior case studies, media and LAD interactions preserved. A related-project link connects the actuator and microscope pages. The microscope project page works locally; external reference links require internet access.


## Version 13 — muted microscope clip
- The breadboard prototype walkthrough video has no audio stream; other media is unchanged.

## Version 14 — ongoing RISC-V kernel project
- Adds `projects/ece391.html`, `assets/ece391/kernel-stack.svg` and a dedicated Ongoing projects section on the homepage. Existing five case studies and media are preserved from the Version 13 archive.
- The conceptual diagram is original explanatory artwork, not an actual boot screenshot. Course scope and MP3 deadline are sourced from the public Fall 2026 UIUC syllabus, schedule and assignment pages, with the Illinois HKN course overview as supplementary context.
- Individual MP1/MP2 work and collaborative MP3 scope are explicitly distinguished. No assignment source code, solutions, unverified test outcomes or claims of a finished kernel are included. Review the personal contribution summary and publication permissions before sharing the site.

## Version 16 - restored ECE 391 and JPEG speed illustration
- Uses the complete Version 14 portfolio as the base, preserving all six projects and their media. Merges the Version 15 interactive JPEG software/hardware comparison, which uses illustrative parameters rather than measured performance.
- Restores the Ongoing projects navigation, RISC-V kernel page, diagram and associated styles missing from Version 15.


## Version 17 — live JPEG camera simulation and public research overview
- Starts from the consolidated Version 16 site and preserves every earlier project, including ECE 391.
- Replaces the JPEG decoder's abstract timing calculator with a synthetic, synchronized camera scene and software/hardware decoder outputs. Configurable input and decode capacities, completed-frame FPS, frame age, dropped frames, playback controls, and progressive-write versus double-buffered modes demonstrate visible scanline updates and lag. All timing values are simulated, not measured; no JPEG decoding is executed.
- Adds `projects/mri-research.html` and a text-only homepage feature about ongoing white-matter segmentation research in Professor Zhi-Pei Liang’s group. Public copy describes expert disagreement, evaluation of established approaches and research directions without private images, data, unpublished methods, internal results or unsupported performance/completion claims. No research materials are bundled.

## Version 18
- `projects/ece364.html`: individual December 2025 PASCAL VOC segmentation project; original training and validation figures, reported configuration comparison, limitations.
- All V17 projects and assets retained. No private MRI data or research archive added.

## Version 19 — realistic JPEG simulation bounds
- Camera capture: 5–15 FPS (default 15), based on the acquisition rate described in the ECE 385 report. HDMI refresh is separately identified as 60 Hz. Both hypothetical decoder capacities are limited to 1–30 FPS, defaulting to 5 (software) and 20 (hardware). Completed throughput cannot exceed capture or decode capacity; faster processing reduces frame age, not the number of source frames.
- Preserves the progressive scanline and double-buffered modes, playback controls, and all eight V18 projects. No measured hardware performance is claimed.


## Version 20
- Added a personal gallery page under Journal & Life, with curated photos of cats, miniature models, outdoor moments, and home cooking, plus a short frying-rice clip.


## Version 21
- Expanded Journal & Life with 22 distinct culinary photos (including alternate views and preparation shots), five cooking clips, additional outdoor photos, three outdoor videos, and a gym photo. Duplicate exports merged; the coursework-interface image was omitted from the public-facing site.
- Personal gallery media optimized for web display; new videos are H.264/AAC and retain original duration. All eight academic project pages are unchanged.


## Version 22 — silent, deduplicated video gallery
- All 31 retained published video files are silent: 30 audio tracks removed and one previously silent clip retained. Original encoded video streams, frame counts and video durations are unchanged (stream-copy and SHA-256 verification).
- Removed the alternate square crop of the same wok-toss footage, keeping the wider version. The culinary gallery now contains four distinct clips; all eight academic case studies remain present.
- Audio removal is intentionally conservative: ambient sound as well as speech was removed, because speech could not be reliably verified clip by clip. Original source uploads are unchanged. Earlier audio-preservation notes above describe historical versions only.


## Version 23 — solar irrigation
- Added a dedicated solar-powered balcony irrigation case study and homepage card, plus a garden link from Journal & Life. Includes the original May 2025 demonstration and two installation photos; reuses the existing September flower photo.
- Added the separate December evening-outdoors clip to Journal & Life. Both new videos are H.264, silent, and retain the source footage duration to within frame rounding; photos are optimized and installation photos cropped to focus on equipment.
- Corrected the cooking navigation count from five clips to four, consistent with V22 deduplication. No measured irrigation performance is claimed.


## Version 24
- Added a campus aurora photograph to the Outdoors section of Journal & Life. The image is web-optimized without color enhancement; metadata is omitted. All existing projects and silent videos are unchanged.


## Version 25
Open Arnold_Tao_Portfolio_v25/index.html. The homepage Journal & Life section links directly to the aurora photo.
