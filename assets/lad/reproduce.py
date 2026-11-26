"""2026 reproducibility supplement to Arnold Tao's June 2022 calculus project.
Run: python -m pip install numpy scipy matplotlib; python reproduce.py
All five observations and the two fixed exponents are from the original report.
Produces data.csv, candidates.csv and two figures alongside this script.
"""
from pathlib import Path
from itertools import combinations
import csv
import numpy as np
from scipy.optimize import linprog
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = Path(__file__).resolve().parent
starts = np.array([0., 1., 2., 4., 6.])
y = np.array([61.4, 64.2, 67.0, 73.1, 79.6])

def design(l):
    l = np.asarray(l)
    return np.column_stack((np.exp(.025*l)*np.expm1(.025)/.025,
                            -np.exp(.02*l)*np.expm1(.02)/.02))

X = design(starts)

def enumerate_lad(X, y):
    n, p = X.shape
    if np.linalg.matrix_rank(X) != p:
        raise ValueError('Full column rank required for this enumeration theorem')
    results = []
    for idx in combinations(range(n), p):
        S = X[list(idx)]
        if np.linalg.matrix_rank(S) == p:
            beta = np.linalg.solve(S, y[list(idx)])
            results.append((float(np.abs(X @ beta - y).sum()), idx, beta))
    return sorted(results, key=lambda r: r[0])

candidates = enumerate_lad(X, y)
loss, pair, beta = candidates[0]
r = X @ beta - y
ols = np.linalg.lstsq(X, y, rcond=None)[0]
r_ols = X @ ols - y
# Independent epigraph LP: minimize sum(t) subject to +/- (X beta - y) <= t.
n,p = X.shape
lp = linprog(np.r_[np.zeros(p), np.ones(n)],
    A_ub=np.block([[X, -np.eye(n)], [-X, -np.eye(n)]]),
    b_ub=np.r_[y,-y], bounds=[(None,None)]*p+[(0,None)]*n, method='highs')
assert lp.success and np.allclose(lp.x[:p], beta, atol=1e-7, rtol=0)
assert np.isclose(lp.fun,loss,atol=1e-8,rtol=0)
# A strict dual/subgradient certificate on the active pair proves uniqueness.
Z = np.array(pair); R = np.array([i for i in range(n) if i not in pair])
u = np.zeros(n); u[R] = np.sign(r[R]); u[Z] = np.linalg.solve(X[Z].T, -X[R].T @ u[R])
assert np.max(np.abs(u[Z])) < 1 and np.linalg.norm(X.T @ u) < 1e-10
assert np.isclose(-y @ u,loss,atol=1e-8,rtol=0)
all_l=np.arange(8); fitted=design(all_l)@beta
print('LAD:', beta, 'total absolute error:', loss, 'residuals:',r)
print('LP:',lp.x[:p], 'objective:',lp.fun)
print('OLS:',ols,'total absolute error:',abs(r_ols).sum())
print('SSE LAD/OLS:',r@r,r_ols@r_ols)
print('Dual:',u,'lower bound:',-y@u,'condition number:',np.linalg.cond(X))
print('Predictions:',fitted, 'last-first:',fitted[-1]-fitted[0])
with (OUT/'data.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['start_cm','end_cm','observed_mg','LAD_prediction_mg','OLS_prediction_mg'])
    for l,v in zip(all_l,fitted):
        j=np.where(starts==l)[0]; w.writerow([l,l+1,y[j[0]] if len(j) else '',v,(design([l])@ols)[0]])
with (OUT/'candidates.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['observation_1','observation_2','A','B','sum_absolute_error_mg'])
    for val,ids,b in candidates: w.writerow([ids[0]+1,ids[1]+1,*b,val])
# Plot in well-resolved coordinates B and C=A-B to reveal the narrow valley.
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False,'axes.labelcolor':'#34493e','xtick.color':'#34493e','ytick.color':'#34493e','text.color':'#25352b','axes.titlecolor':'#25352b','figure.facecolor':'#ffffff','axes.facecolor':'#ffffff'})
B=np.linspace(221,244,600); C=np.linspace(59.6,60.65,500)
BB,CC=np.meshgrid(B,C); L=sum(abs(X[i,0]*(CC+BB)+X[i,1]*BB-y[i]) for i in range(n))
fig,ax=plt.subplots(figsize=(8.5,5.4),layout='constrained')
levels=[.12,.2,.35,.6,1.,1.5,2.5,4.,6.]
cf=ax.contourf(BB,CC,L,levels=[loss-.0001,*levels,10.],cmap='YlGnBu_r',extend='max',alpha=.76)
fig.colorbar(cf,ax=ax,label='Total absolute residual (mg)',shrink=.82)
for i in range(n):
    c=(y[i]-(X[i,0]+X[i,1])*B)/X[i,0]
    ax.plot(B,c,lw=1.3,color='#283b38',alpha=.8,ls=['-','--','-.',':','-'][i],label=f'r{i+1} = 0')
for val,ids,b in candidates: ax.scatter(b[1],b[0]-b[1],s=22,facecolor='white',edgecolor='#30483a',zorder=4)
ax.scatter(beta[1],beta[0]-beta[1],marker='*',s=210,c='#b45f2e',edgecolors='white',linewidths=.9,zorder=6,label='Global minimum')
ax.annotate('Minimum: 0.104252 mg',xy=(beta[1],beta[0]-beta[1]),xytext=(223,59.83),arrowprops=dict(arrowstyle='->',color='#81431e'),color='#81431e',fontsize=10,bbox=dict(boxstyle='round,pad=.25',fc='white',ec='none',alpha=.9))
ax.set(xlim=(221,244),ylim=(59.6,60.65),xlabel='B',ylabel='C = A − B',title='Residual-zero lines and the convex loss landscape')
ax.legend(loc='upper right',ncol=2,fontsize=8,framealpha=.9);fig.savefig(OUT/'landscape.webp',dpi=170);plt.close(fig)
fig,ax=plt.subplots(figsize=(8.5,4.5),layout='constrained')
ax.plot(all_l+.5,fitted,color='#255e47',lw=2.2,label='LAD fit (interval integral)')
ax.plot(all_l+.5,design(all_l)@ols,color='#9b7651',lw=1.4,ls='--',label='OLS fit')
ax.scatter(starts+.5,y,color='#23352a',s=55,edgecolors='white',zorder=5,label='Original observations')
missing=np.array([3,5,7]);ax.scatter(missing+.5,fitted[missing],facecolors='white',edgecolors='#255e47',s=60,zorder=5,label='Unmeasured intervals')
ax.set(xlabel='Interval midpoint (cm)',ylabel='Amount per 1 cm interval (mg)',title='Fit to the five reported observations');ax.grid(alpha=.17);ax.legend(frameon=False,loc='upper left');fig.savefig(OUT/'fit.webp',dpi=170);plt.close(fig)
