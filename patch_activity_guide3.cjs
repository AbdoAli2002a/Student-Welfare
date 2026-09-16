const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

const endOld = `                  </div>
                </section>
                
              </div>
            </div>
          </div>
        </div>
      </div>`;

const endNew = `                  </div>
                </section>
                
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

if (code.includes(endOld)) {
    code = code.replace(endOld, endNew);
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
