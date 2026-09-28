from pathlib import Path
import re, json
root=Path('/home/ubuntu/page_texts')
terms=['6291169','6203022','6582908','6513689','6588349','6681517','6513285','6588878','6588879','6615146','6573737','6302559','6680064','JX72HW8HC7','JX72HWLZ49','111488395','5256988836','6513002','6471084','6570530','6605884','6357659','6553385','J7R2YVKXT2','5032284836']
for term in terms:
    files=[p for p in root.glob('*.md') if term.lower() in p.name.lower()]
    print('\nTERM',term,'FILES',len(files))
    for p in files:
      s=p.read_text(errors='ignore')
      # print compact useful lines
      lines=[x.strip() for x in s.splitlines() if x.strip()]
      useful=[]
      for x in lines:
        if re.search(r'^(# |\*\*Title|\*\*Price|\*\*Description|\*\*Main|Current price|## .*|Model:|SKU:|\$[0-9])',x,re.I) or ('bbystatic' in x) or ('walmartimages' in x):
          useful.append(re.sub(r'\s+',' ',x))
      print('FILE',p.name)
      print('\n'.join(useful[:25]))
