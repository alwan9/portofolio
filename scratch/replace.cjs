const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add ScrollReveal component
if (!content.includes('const ScrollReveal')) {
  content = content.replace(
    '// Animated Counter Component for premium feels',
    `// Scroll Reveal Component
const ScrollReveal = ({ children, direction = "up", delay = 0, className = "", id }) => {
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
    none: { x: 0, y: 0 }
  };
  
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Animated Counter Component for premium feels`
  );
}

// 2. Replace specific section tags with ScrollReveal tags
const sectionsToReplace = [
  {
    find: '<section className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">',
    replace: '<ScrollReveal direction="up" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">',
    dir: 'up'
  },
  {
    find: '<section className="py-16 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-b border-zinc-900">',
    replace: '<ScrollReveal direction="up" className="py-16 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-b border-zinc-900">',
    dir: 'up'
  },
  {
    find: '<section id="about" className="py-28 bg-zinc-950 relative overflow-hidden">',
    replace: '<ScrollReveal direction="left" id="about" className="py-28 bg-zinc-950 relative overflow-hidden">',
    dir: 'left'
  },
  {
    find: '<section id="journey" className="py-20 bg-zinc-950 bg-dots relative border-b border-zinc-900">',
    replace: '<ScrollReveal direction="right" id="journey" className="py-20 bg-zinc-950 bg-dots relative border-b border-zinc-900">',
    dir: 'right'
  },
  {
    find: '<section className="relative overflow-hidden py-10 bg-zinc-900 bg-dots border-t border-b border-zinc-800">',
    replace: '<ScrollReveal direction="up" className="relative overflow-hidden py-10 bg-zinc-900 bg-dots border-t border-b border-zinc-800">',
    dir: 'up'
  },
  {
    find: '<section id="favorit" className="py-24 bg-zinc-950 bg-dots">',
    replace: '<ScrollReveal direction="up" id="favorit" className="py-24 bg-zinc-950 bg-dots">',
    dir: 'up'
  },
  {
    find: '<section id="all" className="py-24 bg-zinc-900/40 bg-dots border-t border-zinc-900">',
    replace: '<ScrollReveal direction="up" id="all" className="py-24 bg-zinc-900/40 bg-dots border-t border-zinc-900">',
    dir: 'up'
  }
];

sectionsToReplace.forEach(({find, replace}) => {
  if (content.includes(find)) {
    // Replace the opening tag
    content = content.replace(find, replace);
    
    // Now we need to find the matching closing </section>
    // A simple hack since we know the structure:
    // we'll replace </section> that comes BEFORE the next section or footer.
    // However, it's safer to just replace all </section> that are at exactly 6 spaces indentation
    // because all the main sections are indented with 6 spaces: `      </section>`
  }
});

// Since all target sections are at 6 spaces indentation, we can just replace them.
// Wait, we can just do a regex replace for '      </section>' -> '      </ScrollReveal>'
content = content.replace(/ {6}<\/section>/g, '      </ScrollReveal>');

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx updated successfully.');
